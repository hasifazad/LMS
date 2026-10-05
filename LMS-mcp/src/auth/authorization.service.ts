import { LmsApiService, LmsApiRequestOptions } from '../services/lms-api.service.js';
import { StudentRaw } from '../types/lms.types.js';
import { forbidden, notFound } from '../utils/errors.js';
import { UserContext, UserRole } from './user-context.js';

/**
 * Role-based authorization.
 *
 * The model chooses *which tool* to call, never *who the caller is*. The caller is
 * taken from `UserContext`, and every decision below is made from that object plus
 * data read back from the LMS API.
 *
 * Why this layer has to exist: `LMS-server` currently applies `tokenValidation` to
 * exactly one route (`GET /api/v1/trainer/validate`). The student, batch and course
 * read routes are unauthenticated, and the student login endpoint does not issue a
 * token. The MCP server therefore cannot rely on upstream enforcement and treats
 * itself as the authorization boundary for every tool it exposes.
 *
 * | Capability                    | student | trainer | mentor | admin |
 * | ----------------------------- | ------- | ------- | ------ | ----- |
 * | read own profile              |   yes   |   -     |   -    |  yes  |
 * | read own assignments/attendance/projects/course/batch | yes | - | - | yes |
 * | read another student's records |   no    |  assigned only | assigned only | yes |
 * | read batch/course catalogue   |   no    |  yes    |  yes   |  yes  |
 * | read organisation statistics  |   no    |   no    |   no   |  yes  |
 */

export type Capability =
  | 'self:read'
  | 'peers:read'
  | 'batch:read'
  | 'course:read'
  | 'org:read';

const CAPABILITIES: Record<UserRole, readonly Capability[]> = {
  student: ['self:read'],
  trainer: ['self:read', 'peers:read', 'batch:read', 'course:read'],
  mentor: ['self:read', 'peers:read', 'batch:read', 'course:read'],
  admin: ['self:read', 'peers:read', 'batch:read', 'course:read', 'org:read'],
};

export class AuthorizationService {
  constructor(private readonly lmsApi: LmsApiService) {}

  /** Throws `FORBIDDEN` when the caller's role does not hold the capability. */
  assertCapability(user: UserContext, capability: Capability): void {
    if (!CAPABILITIES[user.role].includes(capability)) {
      throw forbidden(
        `Role "${user.role}" is not permitted to perform this operation. ` +
          `Required capability: ${capability}.`,
      );
    }
  }

  can(user: UserContext, capability: Capability): boolean {
    return CAPABILITIES[user.role].includes(capability);
  }

  /**
   * Resolves which student a call operates on, and refuses anything the caller may
   * not read.
   *
   * - student: always their own account. A tool may not accept an id at all, so the
   *   `requestedStudentId` argument only exists for the trainer/admin paths.
   * - trainer/mentor: only students they mentor, verified against
   *   `GET /student/by-mentor`.
   * - admin: any student.
   */
  async resolveStudentScope(
    user: UserContext,
    requestedStudentId?: string,
  ): Promise<{ studentId: string; request: LmsApiRequestOptions }> {
    const request: LmsApiRequestOptions = { user };

    if (user.role === 'student') {
      if (requestedStudentId && requestedStudentId !== user.userId) {
        // Defence in depth: "my" tools never pass an id, so this only triggers if a
        // future tool starts accepting one.
        throw forbidden('Students may only access their own records.');
      }
      return { studentId: user.userId, request };
    }

    if (!requestedStudentId) {
      throw forbidden(`Role "${user.role}" must specify which student to read.`);
    }

    this.assertCapability(user, 'peers:read');

    if (user.role === 'admin') {
      return { studentId: requestedStudentId, request };
    }

    const assigned = await this.getAssignedStudentIds(user, request);
    if (!assigned.has(requestedStudentId)) {
      throw forbidden('This student is not assigned to you as a mentor.');
    }
    return { studentId: requestedStudentId, request };
  }

  /** Mentors/trainers may only read students whose `mentor` field points at them. */
  async getAssignedStudentIds(
    user: UserContext,
    request: LmsApiRequestOptions = { user },
  ): Promise<Set<string>> {
    const students = await this.lmsApi.getStudentsByMentor(user.userId, request);
    return new Set(students.map((student: StudentRaw) => student._id));
  }

  /**
   * Checks that a batch or course the caller named by id is one they may read.
   * Students are restricted to their own batch/course; staff may read any.
   */
  async assertResourceVisible(
    user: UserContext,
    kind: 'batch' | 'course',
    resourceId: string,
    request: LmsApiRequestOptions = { user },
  ): Promise<void> {
    if (user.role !== 'student') {
      this.assertCapability(user, kind === 'batch' ? 'batch:read' : 'course:read');
      return;
    }

    const student = await this.lmsApi.getStudent(user.userId, request);
    const ownedId = kind === 'batch' ? student.batch?._id : student.course?._id;
    if (!ownedId) {
      throw notFound(`No ${kind} is assigned to your account.`);
    }
    if (ownedId !== resourceId) {
      throw forbidden(`You may only read your own ${kind}.`);
    }
  }
}

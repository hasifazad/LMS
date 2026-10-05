import { createToolHandler, ToolDependencies, ToolSuccessPayload } from './tool-context.js';
import {
  toBatchSummary,
  toCourseSummary,
  toStudentCourseSummary,
  toStudentProfileSummary,
  toStudentSummary,
} from './normalizers.js';
import { notFound } from '../utils/errors.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Self-scoped student tools.
 *
 * None of these tools accepts a student id. The subject is always the authenticated
 * user resolved from `UserContext`, so the model cannot read another student's data
 * by inventing an argument.
 */
export function registerStudentTools(server: McpServer, deps: ToolDependencies): void {
  server.registerTool(
    'get_my_profile',
    {
      title: 'Get my profile',
      description:
        "Returns the profile of the LMS user this chat belongs to. Includes name, " +
        'enrollment number, status, contact details and the assigned mentor, batch and ' +
        'course. Takes no arguments. Use this when the user asks who they are or for ' +
        'their own student details.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_my_profile', async (_args, d): Promise<ToolSuccessPayload> => {
      const user = await d.auth.resolve();
      const { studentId, request } = await d.authorization.resolveStudentScope(user);
      const student = await d.lmsApi.getStudent(studentId, request);
      return { success: true, ...toStudentProfileSummary(student) };
    }),
  );

  server.registerTool(
    'get_my_batch',
    {
      title: 'Get my batch',
      description:
        "Returns the batch the authenticated user is enrolled in: batch name and code, " +
        'schedule (days and start/end time), start and end dates, the number of students ' +
        'in the batch, the mentor and the course. Takes no arguments. Use this for ' +
        '"which batch am I in", timetable or batch schedule questions.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_my_batch', async (_args, d): Promise<ToolSuccessPayload> => {
      const user = await d.auth.resolve();
      const { studentId, request } = await d.authorization.resolveStudentScope(user);
      const student = await d.lmsApi.getStudent(studentId, request);

      if (!student.batch?._id) {
        throw notFound('You are not enrolled in a batch yet.');
      }

      const batch = await d.lmsApi.getBatch(student.batch._id, request);
      if (!batch) {
        throw notFound('The batch record for your enrolment could not be found.');
      }

      return { success: true, student: toStudentSummary(student), batch: toBatchSummary(batch) };
    }),
  );

  server.registerTool(
    'get_my_course',
    {
      title: 'Get my course',
      description:
        "Returns the course the authenticated user is enrolled in, both the course " +
        'catalogue entry (name, code, description, duration) and the per-student ' +
        'enrolment record (mode of class, start and end date, and every module with ' +
        'its status and evaluation marks). Takes no arguments. Use this for course ' +
        'progress, module status and marks questions.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_my_course', async (_args, d): Promise<ToolSuccessPayload> => {
      const user = await d.auth.resolve();
      const { studentId, request } = await d.authorization.resolveStudentScope(user);
      const student = await d.lmsApi.getStudent(studentId, request);

      if (!student.course?._id) {
        throw notFound('You are not enrolled in a course yet.');
      }

      const [course, enrolment] = await Promise.all([
        d.lmsApi.getCourse(student.course._id, request),
        d.lmsApi.getStudentCourse(studentId, request),
      ]);

      return {
        success: true,
        student: toStudentSummary(student),
        course: course ? toCourseSummary(course) : null,
        enrolment: toStudentCourseSummary(enrolment),
      };
    }),
  );
}

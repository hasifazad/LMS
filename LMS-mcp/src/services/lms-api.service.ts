import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import {
  AssignmentRaw,
  AttendanceSummaryRaw,
  BatchRaw,
  CourseListItemRaw,
  CourseRaw,
  ProjectRaw,
  StudentCourseRaw,
  StudentRaw,
  SuccessEnvelope,
} from '../types/lms.types.js';
import {
  LmsMcpError,
  LmsMcpErrorCode,
  lmsApiUnavailable,
  lmsApiError,
  notFound,
  unauthenticated,
  forbidden,
  invalidInput,
} from '../utils/errors.js';
import { UserContext } from '../auth/user-context.js';

/**
 * The single place where LMS-server URLs and response envelopes are known.
 *
 * Every endpoint below was read out of `LMS-server/src/routes/*` and
 * `LMS-server/src/controllers/*`; none of them is invented. Tools must not build
 * their own URLs — they call these methods so that path changes stay in one file.
 */

const MAX_UPSTREAM_MESSAGE_LENGTH = 200;

export interface LmsApiRequestOptions {
  /** Caller, used for the organisation header and the optional bearer token. */
  user: UserContext;
}

interface ErrorEnvelope {
  success?: boolean;
  message?: string;
  error?: string | { code?: string; message?: string };
}

/** Returns the upstream `message` when it is safe to forward, otherwise undefined. */
function extractUpstreamMessage(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) return undefined;
  const { message } = body as ErrorEnvelope;
  if (typeof message !== 'string') return undefined;
  const trimmed = message.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_UPSTREAM_MESSAGE_LENGTH) return undefined;
  // Defensive: never forward anything that looks like a URI, token or stack frame.
  if (/mongodb(\+srv)?:\/\//i.test(trimmed)) return undefined;
  if (/\n\s*at\s/.test(trimmed)) return undefined;
  return trimmed;
}

function statusToErrorCode(status: number): LmsMcpErrorCode {
  if (status === 400) return 'INVALID_INPUT';
  if (status === 401) return 'UNAUTHENTICATED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 502 || status === 503 || status === 504) return 'LMS_API_UNAVAILABLE';
  return 'LMS_API_ERROR';
}

function toLmsMcpError(error: unknown): LmsMcpError {
  if (error instanceof LmsMcpError) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorEnvelope>;
    logger.debug('LMS API request failed', {
      method: axiosError.config?.method?.toUpperCase(),
      path: axiosError.config?.url,
      status: axiosError.response?.status,
      code: axiosError.code,
    });

    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      return lmsApiUnavailable(error);
    }

    const response = axiosError.response;
    if (!response) {
      // No response: DNS failure, connection refused, TLS failure, socket hangup.
      return lmsApiUnavailable(error);
    }

    const code = statusToErrorCode(response.status);
    const upstreamMessage = extractUpstreamMessage(response.data);

    switch (code) {
      case 'INVALID_INPUT':
        return invalidInput(upstreamMessage ?? 'The LMS API rejected the supplied identifiers.');
      case 'UNAUTHENTICATED':
        return unauthenticated(upstreamMessage ?? 'The LMS API rejected the credentials for this session.');
      case 'FORBIDDEN':
        return forbidden(upstreamMessage ?? 'The LMS API denied this request.');
      case 'NOT_FOUND':
        return notFound(upstreamMessage ?? 'The requested resource does not exist.');
      default:
        return lmsApiError(upstreamMessage ?? 'The LMS API returned an unexpected response.', error);
    }
  }

  return lmsApiError('The LMS API request could not be completed.', error);
}

function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: `${env.lmsApiUrl}${env.lmsApiBasePath}`,
    timeout: env.requestTimeoutMs,
    headers: { Accept: 'application/json' },
    // Follow redirects and normalise 5xx into rejections that we translate below.
    maxRedirects: 3,
  });

  instance.interceptors.request.use((config) => {
    // `LMS-server` scopes every request after this header. Sending it keeps the MCP
    // server on the same multi-organisation path as the frontends.
    config.headers.set('x-organization-id', env.organizationId);
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toLmsMcpError(error)),
  );

  return instance;
}

export interface LmsApiServiceOptions {
  /** Optional per-request session token, forwarded as `Authorization: Bearer ...`. */
  sessionToken?: string;
}

export class LmsApiService {
  private readonly http: AxiosInstance;
  private readonly sessionToken?: string;

  constructor(options: LmsApiServiceOptions = {}) {
    this.http = createHttpClient();
    if (options.sessionToken !== undefined) this.sessionToken = options.sessionToken;
  }

  /** Per-call options: the organisation header comes from the caller's context. */
  private authHeaders(options: LmsApiRequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      'x-organization-id': options.user.organizationId ?? env.organizationId,
    };
    const token = options.user.sessionToken ?? this.sessionToken;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  private async get<TData>(
    path: string,
    options: LmsApiRequestOptions,
    query?: Record<string, string | undefined>,
  ): Promise<TData> {
    const response = await this.http.get<SuccessEnvelope<TData>>(path, {
      headers: this.authHeaders(options),
      params: query,
    });
    return response.data.data;
  }

  /* ---------------------------------------------------------------- *
   * Student — /api/v1/student
   * ---------------------------------------------------------------- */

  /** `GET /api/v1/student/:id` */
  async getStudent(studentId: string, options: LmsApiRequestOptions): Promise<StudentRaw> {
    return this.get<StudentRaw>(`/student/${studentId}`, options);
  }

  /** `GET /api/v1/student` */
  async getAllStudents(options: LmsApiRequestOptions): Promise<StudentRaw[]> {
    const students = await this.get<StudentRaw[]>('/student', options);
    return Array.isArray(students) ? students : [];
  }

  /** `GET /api/v1/student/by-mentor?mentorId=` */
  async getStudentsByMentor(
    mentorId: string,
    options: LmsApiRequestOptions,
  ): Promise<StudentRaw[]> {
    const students = await this.get<StudentRaw[]>('/student/by-mentor', options, { mentorId });
    return Array.isArray(students) ? students : [];
  }

  /**
   * `GET /api/v1/student/:id/course/module`
   *
   * The LMS answers `{ data: course }` with HTTP 200 and an **empty** `data` when the
   * student has no course record (`getModules` in student.controller.js).
   */
  async getStudentCourse(
    studentId: string,
    options: LmsApiRequestOptions,
  ): Promise<StudentCourseRaw | null> {
    const course = await this.get<StudentCourseRaw | null>(
      `/student/${studentId}/course/module`,
      options,
    );
    return course ?? null;
  }

  /** `GET /api/v1/student/:id/assignment` */
  async getStudentAssignments(
    studentId: string,
    options: LmsApiRequestOptions,
  ): Promise<AssignmentRaw[]> {
    const assignments = await this.get<AssignmentRaw[]>(`/student/${studentId}/assignment`, options);
    return Array.isArray(assignments) ? assignments : [];
  }

  /**
   * `GET /api/v1/student/attendance/:id`
   *
   * When the student has no records the LMS answers HTTP 200 with `success: false` and
   * `data: []`, so an empty array is a valid, non-error result.
   */
  async getStudentAttendance(
    studentId: string,
    options: LmsApiRequestOptions,
  ): Promise<AttendanceSummaryRaw | null> {
    const summary = await this.get<AttendanceSummaryRaw[] | null>(
      `/student/attendance/${studentId}`,
      options,
    );
    if (Array.isArray(summary)) return summary[0] ?? null;
    return summary ?? null;
  }

  /** `GET /api/v1/student/:id/project` */
  async getStudentProjects(
    studentId: string,
    options: LmsApiRequestOptions,
  ): Promise<ProjectRaw[]> {
    const projects = await this.get<ProjectRaw[]>(`/student/${studentId}/project`, options);
    return Array.isArray(projects) ? projects : [];
  }

  /** `GET /api/v1/student/project/:projectId` */
  async getProject(projectId: string, options: LmsApiRequestOptions): Promise<ProjectRaw> {
    return this.get<ProjectRaw>(`/student/project/${projectId}`, options);
  }

  /* ---------------------------------------------------------------- *
   * Batch — /api/v1/batch
   * ---------------------------------------------------------------- */

  /**
   * `GET /api/v1/batch/:batchId`
   *
   * The controller returns the aggregation result, so `data` is a **single-element
   * array**; it is unwrapped here so callers only deal with an object.
   */
  async getBatch(batchId: string, options: LmsApiRequestOptions): Promise<BatchRaw | null> {
    const batches = await this.get<BatchRaw[]>(`/batch/${batchId}`, options);
    if (!Array.isArray(batches) || batches.length === 0) return null;
    return batches[0] ?? null;
  }

  /** `GET /api/v1/batch/:batchId/students` */
  async getBatchWithStudents(
    batchId: string,
    options: LmsApiRequestOptions,
  ): Promise<BatchRaw | null> {
    const batch = await this.get<BatchRaw | null>(`/batch/${batchId}/students`, options);
    return batch ?? null;
  }

  /* ---------------------------------------------------------------- *
   * Course — /api/v1/course
   *
   * `getCourseById` / `getAllCourseNames` answer with HTTP 201 for reads; that is
   * the existing behaviour and is deliberately preserved.
   * ---------------------------------------------------------------- */

  /** `GET /api/v1/course/:id` */
  async getCourse(courseId: string, options: LmsApiRequestOptions): Promise<CourseRaw | null> {
    const course = await this.get<CourseRaw | null>(`/course/${courseId}`, options);
    return course ?? null;
  }

  /** `GET /api/v1/course/list` */
  async getCourseList(options: LmsApiRequestOptions): Promise<CourseListItemRaw[]> {
    const courses = await this.get<CourseListItemRaw[]>('/course/list', options);
    return Array.isArray(courses) ? courses : [];
  }

  /* ---------------------------------------------------------------- *
   * Trainer / mentor / admin — used by the trainer and admin tools,
   * which are not exposed yet. Listed here so the URLs stay in one place.
   * ---------------------------------------------------------------- */

  /** `GET /api/v1/trainer/all` */
  async getAllTrainers(options: LmsApiRequestOptions): Promise<unknown[]> {
    const trainers = await this.get<unknown[]>('/trainer/all', options);
    return Array.isArray(trainers) ? trainers : [];
  }

  /** `GET /api/v1/trainer/mentor/all` */
  async getMentors(options: LmsApiRequestOptions): Promise<unknown[]> {
    const mentors = await this.get<unknown[]>('/trainer/mentor/all', options);
    return Array.isArray(mentors) ? mentors : [];
  }

  /** `GET /api/v1/admin` */
  async getAdminDashboard(
    options: LmsApiRequestOptions,
  ): Promise<{
    totalStudents?: number;
    totalTrainers?: number;
    totalBatches?: number;
    totalCourses?: number;
  } | null> {
    const dashboard = await this.get<{
      totalStudents?: number;
      totalTrainers?: number;
      totalBatches?: number;
      totalCourses?: number;
    } | null>('/admin', options);
    return dashboard ?? null;
  }

  /** Base URL every request is sent to. Exposed for startup diagnostics only. */
  get baseUrl(): string {
    return `${env.lmsApiUrl}${env.lmsApiBasePath}`;
  }
}

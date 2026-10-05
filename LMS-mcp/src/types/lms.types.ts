/**
 * Types for the LMS-server REST contract and for the normalized payloads returned to the LLM.
 *
 * The `*Raw` types mirror the JSON that `LMS-server/src/controllers/*` actually send.
 * They are intentionally partial: the backend is an evolving application, so every field
 * except the ones the tools depend on is optional. Nothing here is invented — if a field
 * is not produced by an existing controller, it is not modelled.
 *
 * The non-raw types are the compact, model-friendly shapes returned by the MCP tools.
 */

/* ------------------------------------------------------------------ *
 * Envelopes
 *
 * The backend is not consistent: some controllers return `{ success, data }`,
 * others `{ message, data }`, some only `{ data }`. `getCourseById` even answers
 * a GET with HTTP 201. These envelopes describe what is actually observed.
 * ------------------------------------------------------------------ */

export interface SuccessEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
}

/* ------------------------------------------------------------------ *
 * Domain enums (mirroring Mongoose schema enums in LMS-server/src/models)
 * ------------------------------------------------------------------ */

export type StudentStatus = 'active' | 'inactive' | 'completed' | 'disconinued';

export type AssignmentStatus = 'submitted' | 'pending';

export type ModuleStatus = 'ongoing' | 'completed' | 'not started';

export type ProjectStatus = 'complete' | 'ongoing' | 'incomplete';

export type CourseMode = 'online' | 'offline';

/* ------------------------------------------------------------------ *
 * Raw shapes returned by LMS-server
 * ------------------------------------------------------------------ */

export interface TrainerRefRaw {
  _id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface BatchRefRaw {
  _id: string;
  batchName?: string | null;
  batchCode?: string | null;
}

export interface CourseRefRaw {
  _id: string;
  courseName?: string | null;
  courseCode?: string | null;
}

/** `GET /api/v1/student/:id` -> `data` */
export interface StudentRaw {
  _id: string;
  email?: string | null;
  mobileNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isBlocked?: boolean | null;
  status?: StudentStatus | null;
  profilePicture?: string | null;
  enrollmentNumber?: string | null;
  github?: string | null;
  linkedin?: string | null;
  guardianName?: string | null;
  resume?: string | null;
  mentor?: TrainerRefRaw | null;
  batch?: BatchRefRaw | null;
  course?: CourseRefRaw | null;
}

/** `GET /api/v1/batch/:batchId` -> `data` is an **array** (aggregation result). */
export interface BatchRaw {
  _id: string;
  batchName?: string | null;
  batchCode?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  day?: string[] | null;
  students?: string[] | null;
  mentor?: TrainerRefRaw | null;
  course?: CourseRefRaw | null;
}

/** `GET /api/v1/course/:id` -> `data` */
export interface CourseRaw {
  _id: string;
  courseCode?: string | null;
  courseName?: string | null;
  description?: string | null;
  duration?: number | null;
  syllabus?: string | null;
  instructors?: string[] | null;
  modules?: string[] | null;
}

/** `GET /api/v1/course/list` -> `data` */
export interface CourseListItemRaw {
  _id: string;
  courseName?: string | null;
  courseCode?: string | null;
}

export interface CourseModuleRaw {
  _id: string;
  moduleName?: string | null;
  status?: ModuleStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  evaluationDate?: string | null;
  remark?: string | null;
  evaluation?: { totalMark?: number | null; mark?: number | null } | null;
}

/** `GET /api/v1/student/:id/course/module` -> `data` (StudentCourse document). */
export interface StudentCourseRaw {
  _id?: string;
  studentId?: string;
  modeOfClass?: CourseMode | null;
  startDate?: string | null;
  endDate?: string | null;
  isCourseCompleted?: boolean | null;
  modules?: CourseModuleRaw[] | null;
}

/** `GET /api/v1/student/:id/assignment` -> `data` */
export interface AssignmentRaw {
  _id: string;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  submissionDate?: string | null;
  grade?: string | null;
  feedback?: string | null;
  fileUrl?: string | null;
  status?: AssignmentStatus | null;
}

export interface AttendanceRecordRaw {
  date: string;
  isPresent: boolean;
}

/** `GET /api/v1/student/attendance/:id` -> `data` */
export interface AttendanceSummaryRaw {
  studentId?: string;
  totalPresent?: number | null;
  totalAbsent?: number | null;
  attendanceRecords?: AttendanceRecordRaw[] | null;
}

export interface ProjectReviewRaw {
  _id: string;
  date?: string | null;
  notes?: string | null;
  taskCompletion?: string | null;
}

/** `GET /api/v1/student/:id/project` -> `data` (array), `GET /api/v1/student/project/:projectId` -> `data` (object). */
export interface ProjectRaw {
  _id: string;
  studentId?: string;
  projectName?: string | null;
  projectStatus?: ProjectStatus | null;
  startDate?: string | null;
  endDate?: string | null;
  completedDate?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  review?: ProjectReviewRaw[] | null;
}

/* ------------------------------------------------------------------ *
 * Normalized payloads returned to the LLM
 *
 * Optional fields are omitted rather than sent as `null` so that the model does not
 * read an absent value as a real one.
 * ------------------------------------------------------------------ */

export interface StudentSummary {
  studentId: string;
  firstName?: string;
  lastName?: string;
  enrollmentNumber?: string;
  status?: StudentStatus;
  isBlocked?: boolean;
}

export interface MentorSummary {
  mentorId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface BatchSummary {
  batchId: string;
  batchName?: string;
  batchCode?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  studentCount?: number;
  mentor?: MentorSummary;
  course?: CourseRefSummary;
}

export interface CourseRefSummary {
  courseId: string;
  courseName?: string;
  courseCode?: string;
}

export interface BatchRefSummary {
  batchId: string;
  batchName?: string;
  batchCode?: string;
}

export interface CourseSummary extends CourseRefSummary {
  description?: string;
  duration?: number;
  syllabus?: string;
  instructorCount?: number;
  moduleCount?: number;
}

export interface CourseModuleSummary {
  moduleId: string;
  moduleName?: string;
  status?: ModuleStatus;
  startDate?: string;
  endDate?: string;
  evaluationDate?: string;
  remark?: string;
  totalMark?: number;
  mark?: number;
}

export interface StudentCourseSummary {
  modeOfClass?: CourseMode;
  startDate?: string;
  endDate?: string;
  isCourseCompleted?: boolean;
  modules: CourseModuleSummary[];
  totalModules: number;
  completedModules: number;
}

export interface AssignmentSummary {
  assignmentId: string;
  title?: string;
  description?: string;
  startDate?: string;
  submissionDate?: string;
  status?: AssignmentStatus;
  grade?: string;
  feedback?: string;
  fileUrl?: string;
}

export interface AssignmentListSummary {
  student: StudentSummary;
  totalAssignments: number;
  submitted: number;
  pending: number;
  assignments: AssignmentSummary[];
}

export interface AttendanceSummary {
  studentId: string;
  totalClasses: number;
  present: number;
  absent: number;
  /** `null` when the LMS holds no attendance records for this student. */
  percentage: number | null;
  records: Array<{ date: string; isPresent: boolean }>;
}

export interface ProjectReviewSummary {
  reviewId: string;
  date?: string;
  notes?: string;
  taskCompletion?: string;
}

export interface ProjectSummary {
  projectId: string;
  projectName?: string;
  projectStatus?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  completedDate?: string;
  projectUrl?: string;
  githubUrl?: string;
  reviews: ProjectReviewSummary[];
}

export interface ProjectListSummary {
  student: StudentSummary;
  totalProjects: number;
  byStatus: { complete: number; ongoing: number; incomplete: number };
  projects: ProjectSummary[];
}

export interface StudentProfileSummary {
  student: StudentSummary & {
    email?: string;
    mobileNumber?: string;
    profilePicture?: string;
    github?: string;
    linkedin?: string;
    resume?: string;
  };
  mentor?: MentorSummary;
  batch?: BatchRefSummary;
  course?: CourseRefSummary;
}

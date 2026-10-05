import {
  AssignmentRaw,
  AssignmentSummary,
  AttendanceSummary,
  AttendanceSummaryRaw,
  BatchRaw,
  BatchRefSummary,
  BatchSummary,
  CourseModuleSummary,
  CourseRaw,
  CourseRefSummary,
  CourseSummary,
  MentorSummary,
  ProjectListSummary,
  ProjectRaw,
  ProjectSummary,
  StudentCourseRaw,
  StudentCourseSummary,
  StudentProfileSummary,
  StudentRaw,
  StudentSummary,
} from '../types/lms.types.js';

/**
 * Raw LMS documents -> compact, model-friendly payloads.
 *
 * Rules applied here:
 *  - fields absent in the LMS response are omitted, never faked;
 *  - dates stay in the ISO-8601 strings the API already returns;
 *  - no field is renamed into something the LMS does not actually store.
 */

function omitUndefined<T extends object>(value: T): T {  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined && v !== null),
  ) as T;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function asCount(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function toStudentSummary(raw: StudentRaw): StudentSummary {
  return omitUndefined({
    studentId: raw._id,
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    enrollmentNumber: asString(raw.enrollmentNumber),
    status: raw.status ?? undefined,
    isBlocked: typeof raw.isBlocked === 'boolean' ? raw.isBlocked : undefined,
  });
}

export function toMentorSummary(raw: StudentRaw['mentor']): MentorSummary | undefined {
  if (!raw?._id) return undefined;
  return omitUndefined({
    mentorId: raw._id,
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    email: asString(raw.email),
  });
}

export function toCourseRefSummary(raw: StudentRaw['course']): CourseRefSummary | undefined {
  if (!raw?._id) return undefined;
  return omitUndefined({
    courseId: raw._id,
    courseName: asString(raw.courseName),
    courseCode: asString(raw.courseCode),
  });
}

export function toBatchRefSummary(raw: StudentRaw['batch']): BatchRefSummary | undefined {
  if (!raw?._id) return undefined;
  return omitUndefined({
    batchId: raw._id,
    batchName: asString(raw.batchName),
    batchCode: asString(raw.batchCode),
  });
}

export function toStudentProfileSummary(raw: StudentRaw): StudentProfileSummary {
  return omitUndefined({
    student: omitUndefined({
      ...toStudentSummary(raw),
      email: asString(raw.email),
      mobileNumber: asString(raw.mobileNumber),
      profilePicture: asString(raw.profilePicture),
      github: asString(raw.github),
      linkedin: asString(raw.linkedin),
      resume: asString(raw.resume),
    }),
    mentor: toMentorSummary(raw.mentor),
    batch: toBatchRefSummary(raw.batch),
    course: toCourseRefSummary(raw.course),
  });
}

export function toBatchSummary(raw: BatchRaw): BatchSummary {
  const mentor: MentorSummary | undefined = raw.mentor?._id
    ? omitUndefined({
        mentorId: raw.mentor._id,
        firstName: asString(raw.mentor.firstName),
        lastName: asString(raw.mentor.lastName),
        email: asString(raw.mentor.email),
      })
    : undefined;

  const course: CourseRefSummary | undefined = raw.course?._id
    ? omitUndefined({
        courseId: raw.course._id,
        courseName: asString(raw.course.courseName),
        courseCode: asString(raw.course.courseCode),
      })
    : undefined;

  return omitUndefined({
    batchId: raw._id,
    batchName: asString(raw.batchName),
    batchCode: asString(raw.batchCode),
    startDate: asString(raw.startDate),
    endDate: asString(raw.endDate),
    startTime: asString(raw.startTime),
    endTime: asString(raw.endTime),
    days: Array.isArray(raw.day) && raw.day.length > 0 ? raw.day : undefined,
    studentCount: Array.isArray(raw.students) ? raw.students.length : undefined,
    mentor,
    course,
  });
}

export function toCourseSummary(raw: CourseRaw): CourseSummary {
  return omitUndefined({
    courseId: raw._id,
    courseName: asString(raw.courseName),
    courseCode: asString(raw.courseCode),
    description: asString(raw.description),
    duration: asCount(raw.duration),
    syllabus: asString(raw.syllabus),
    instructorCount: Array.isArray(raw.instructors) ? raw.instructors.length : undefined,
    moduleCount: Array.isArray(raw.modules) ? raw.modules.length : undefined,
  });
}

function toModuleSummary(raw: NonNullable<StudentCourseRaw['modules']>[number]): CourseModuleSummary {
  return omitUndefined({
    moduleId: raw._id,
    moduleName: asString(raw.moduleName),
    status: raw.status ?? undefined,
    startDate: asString(raw.startDate),
    endDate: asString(raw.endDate),
    evaluationDate: asString(raw.evaluationDate),
    remark: asString(raw.remark),
    totalMark: asCount(raw.evaluation?.totalMark),
    mark: asCount(raw.evaluation?.mark),
  });
}

export function toStudentCourseSummary(raw: StudentCourseRaw | null): StudentCourseSummary {
  const modules = Array.isArray(raw?.modules) ? raw.modules : [];
  const summaries = modules.map(toModuleSummary);
  return omitUndefined({
    modeOfClass: raw?.modeOfClass ?? undefined,
    startDate: asString(raw?.startDate),
    endDate: asString(raw?.endDate),
    isCourseCompleted: typeof raw?.isCourseCompleted === 'boolean' ? raw.isCourseCompleted : undefined,
    modules: summaries,
    totalModules: summaries.length,
    completedModules: summaries.filter((module) => module.status === 'completed').length,
  });
}

export function toAssignmentSummary(raw: AssignmentRaw): AssignmentSummary {
  return omitUndefined({
    assignmentId: raw._id,
    title: asString(raw.title),
    description: asString(raw.description),
    startDate: asString(raw.startDate),
    submissionDate: asString(raw.submissionDate),
    status: raw.status ?? undefined,
    grade: asString(raw.grade),
    feedback: asString(raw.feedback),
    fileUrl: asString(raw.fileUrl),
  });
}

export function toAssignmentList(
  student: StudentSummary,
  assignments: AssignmentRaw[],
): { totalAssignments: number; submitted: number; pending: number; assignments: AssignmentSummary[] } {
  const summaries = assignments.map(toAssignmentSummary);
  return {
    totalAssignments: summaries.length,
    submitted: summaries.filter((assignment) => assignment.status === 'submitted').length,
    pending: summaries.filter((assignment) => assignment.status === 'pending').length,
    assignments: summaries,
  };
}

/**
 * Attendance totals are derived from the per-day records, which is the same basis the
 * `LMS-client` `ViewAttendance` component uses. The `totalPresent` / `totalAbsent`
 * counters reported by the API are only used when no records are returned.
 *
 * `percentage` is `null` — not `0` — when the LMS holds no records, so the model cannot
 * mistake "no data" for "0% attendance".
 */
export function toAttendanceSummary(
  studentId: string,
  raw: AttendanceSummaryRaw | null,
): AttendanceSummary {
  const records = Array.isArray(raw?.attendanceRecords) ? raw.attendanceRecords : [];

  if (records.length === 0) {
    return {
      studentId,
      totalClasses: 0,
      present: asCount(raw?.totalPresent) ?? 0,
      absent: asCount(raw?.totalAbsent) ?? 0,
      percentage: null,
      records: [],
    };
  }

  const present = records.filter((record) => record.isPresent === true).length;
  const totalClasses = records.length;
  const absent = totalClasses - present;

  return {
    studentId,
    totalClasses,
    present,
    absent,
    percentage: Math.round((present / totalClasses) * 10_000) / 100,
    records: records.map((record) => ({ date: record.date, isPresent: record.isPresent })),
  };
}

function toProjectSummary(raw: ProjectRaw): ProjectSummary {
  const reviews = Array.isArray(raw.review) ? raw.review : [];
  return omitUndefined({
    projectId: raw._id,
    projectName: asString(raw.projectName),
    projectStatus: raw.projectStatus ?? undefined,
    startDate: asString(raw.startDate),
    endDate: asString(raw.endDate),
    completedDate: asString(raw.completedDate),
    projectUrl: asString(raw.projectUrl),
    githubUrl: asString(raw.githubUrl),
    reviews: reviews.map((review) =>
      omitUndefined({
        reviewId: review._id,
        date: asString(review.date),
        notes: asString(review.notes),
        taskCompletion: asString(review.taskCompletion),
      }),
    ),
  });
}

export function toProjectList(
  student: StudentSummary,
  projects: ProjectRaw[],
): Omit<ProjectListSummary, 'student'> {
  const summaries = projects.map(toProjectSummary);
  return {
    totalProjects: summaries.length,
    byStatus: {
      complete: summaries.filter((project) => project.projectStatus === 'complete').length,
      ongoing: summaries.filter((project) => project.projectStatus === 'ongoing').length,
      incomplete: summaries.filter((project) => project.projectStatus === 'incomplete').length,
    },
    projects: summaries,
  };
}

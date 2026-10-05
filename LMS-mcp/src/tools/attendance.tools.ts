import { createToolHandler, ToolDependencies, ToolSuccessPayload } from './tool-context.js';
import { toAttendanceSummary, toStudentSummary } from './normalizers.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Attendance tool.
 *
 * The LMS `getAttendanceDetailsByStudentId` controller returns per-day records plus
 * `totalPresent` / `totalAbsent` counters but no percentage, so the percentage is
 * derived here from the same records the `LMS-client` attendance view uses.
 */
export function registerAttendanceTools(server: McpServer, deps: ToolDependencies): void {
  server.registerTool(
    'get_my_attendance',
    {
      title: 'Get my attendance',
      description:
        "Returns the authenticated user's attendance: total classes held, number of " +
        'classes present, number of classes absent, the attendance percentage, and the ' +
        'per-day present/absent records. The percentage is null when the LMS has no ' +
        'attendance records for the user, which means "no data" rather than "0%". ' +
        'Takes no arguments. Use this for attendance percentage, how many classes were ' +
        'missed, and low-attendance questions.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_my_attendance', async (_args, d): Promise<ToolSuccessPayload> => {
      const user = await d.auth.resolve();
      const { studentId, request } = await d.authorization.resolveStudentScope(user);
      const [student, attendance] = await Promise.all([
        d.lmsApi.getStudent(studentId, request),
        d.lmsApi.getStudentAttendance(studentId, request),
      ]);

      return {
        success: true,
        student: toStudentSummary(student),
        attendance: toAttendanceSummary(studentId, attendance),
      };
    }),
  );
}

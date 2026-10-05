import { createToolHandler, ToolDependencies, ToolSuccessPayload } from './tool-context.js';
import { toProjectList, toStudentSummary } from './normalizers.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Project tools.
 *
 * `GET /api/v1/student/:studentId/project` returns a student's projects; the LMS also
 * exposes `GET /api/v1/student/project/:projectId` for a single project, which the
 * trainer/admin tools can use. Only the self-scoped tool is exposed for now.
 */
export function registerProjectTools(server: McpServer, deps: ToolDependencies): void {
  server.registerTool(
    'get_my_projects',
    {
      title: 'Get my projects',
      description:
        "Returns every project recorded for the authenticated user: project name, " +
        'status (complete, ongoing or incomplete), start/end/completed dates, the ' +
        'project and GitHub URLs, and any mentor review notes. Also returns a status ' +
        'breakdown. Takes no arguments. Use this for project portfolio, submission or ' +
        'review-feedback questions.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_my_projects', async (_args, d): Promise<ToolSuccessPayload> => {
      const user = await d.auth.resolve();
      const { studentId, request } = await d.authorization.resolveStudentScope(user);
      const [student, projects] = await Promise.all([
        d.lmsApi.getStudent(studentId, request),
        d.lmsApi.getStudentProjects(studentId, request),
      ]);

      const studentSummary = toStudentSummary(student);
      return {
        success: true,
        student: studentSummary,
        ...toProjectList(studentSummary, projects),
      };
    }),
  );
}

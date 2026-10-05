import { z } from 'zod';
import { createToolHandler, assertObjectId, ToolDependencies, ToolSuccessPayload } from './tool-context.js';
import { toAssignmentList, toAssignmentSummary, toStudentSummary } from './normalizers.js';
import { notFound } from '../utils/errors.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Assignment tools.
 *
 * The LMS stores assignments inside a per-student document
 * (`StudentAssignment.assignments`) and exposes exactly one read route for them:
 * `GET /api/v1/student/:studentId/assignment`. There is no "assignment by id"
 * endpoint, so `get_assignment_details` filters that list server-side in this layer
 * rather than inventing a route.
 */
export function registerAssignmentTools(server: McpServer, deps: ToolDependencies): void {
  server.registerTool(
    'get_my_assignments',
    {
      title: 'Get my assignments',
      description:
        "Returns every assignment recorded for the authenticated user, with title, " +
        'description, start and submission dates, status (submitted or pending), grade, ' +
        'feedback and any attached file URL. Also returns totals: how many assignments ' +
        'exist, how many are submitted and how many are still pending. Takes no ' +
        'arguments. Use this for homework, deadline and submission-status questions.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_my_assignments', async (_args, d): Promise<ToolSuccessPayload> => {
      const user = await d.auth.resolve();
      const { studentId, request } = await d.authorization.resolveStudentScope(user);
      const [student, assignments] = await Promise.all([
        d.lmsApi.getStudent(studentId, request),
        d.lmsApi.getStudentAssignments(studentId, request),
      ]);

      return {
        success: true,
        student: toStudentSummary(student),
        ...toAssignmentList(toStudentSummary(student), assignments),
      };
    }),
  );

  server.registerTool(
    'get_assignment_details',
    {
      title: 'Get assignment details',
      description:
        'Returns one assignment in full, identified by its assignment id: title, ' +
        'description, start and submission dates, status, grade, feedback and file URL. ' +
        "Requires the authenticated user's own assignment id. Use this when the user " +
        'refers to a specific assignment, e.g. by name or by the id returned by ' +
        'get_my_assignments.',
      inputSchema: {
        assignmentId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, 'Must be a 24-character hexadecimal LMS id.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(
      deps,
      'get_assignment_details',
      async (args, d): Promise<ToolSuccessPayload> => {
        const assignmentId = assertObjectId(String(args.assignmentId ?? ''), 'assignmentId');
        const user = await d.auth.resolve();
        const { studentId, request } = await d.authorization.resolveStudentScope(user);
        const assignments = await d.lmsApi.getStudentAssignments(studentId, request);
        const match = assignments.find((assignment) => assignment._id === assignmentId);

        if (!match) {
          throw notFound('No assignment with that id exists on your account.');
        }

        return {
          success: true,
          studentId,
          assignment: toAssignmentSummary(match),
        };
      },
    ),
  );
}

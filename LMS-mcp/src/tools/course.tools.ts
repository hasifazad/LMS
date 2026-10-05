import { z } from 'zod';
import { createToolHandler, assertObjectId, ToolDependencies, ToolSuccessPayload } from './tool-context.js';
import { toCourseSummary } from './normalizers.js';
import { notFound } from '../utils/errors.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Course tools.
 *
 * A course id is not sensitive by itself, but the tool is still role-checked: a student
 * may only read the course they are enrolled in, while trainer/mentor/admin may read
 * any course. That check is enforced by `AuthorizationService.assertResourceVisible`.
 */
export function registerCourseTools(server: McpServer, deps: ToolDependencies): void {
  server.registerTool(
    'get_course_details',
    {
      title: 'Get course details',
      description:
        'Returns one course from the catalogue: name, code, description, duration, ' +
        'syllabus, and the number of instructors and modules. Requires a course id. A ' +
        'student may only read the course they are enrolled in; mentors, trainers and ' +
        'admins may read any course. Use this when the user names a specific course or ' +
        'asks what a course covers. This is catalogue information, not per-student ' +
        'progress — use get_my_course for progress.',
      inputSchema: {
        courseId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, 'Must be a 24-character hexadecimal LMS id.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_course_details', async (args, d): Promise<ToolSuccessPayload> => {
      const courseId = assertObjectId(String(args.courseId ?? ''), 'courseId');
      const user = await d.auth.resolve();
      const request = { user };
      await d.authorization.assertResourceVisible(user, 'course', courseId, request);

      const course = await d.lmsApi.getCourse(courseId, request);
      if (!course) {
        throw notFound('No course with that id exists.');
      }

      return { success: true, course: toCourseSummary(course) };
    }),
  );
}

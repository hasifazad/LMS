import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createToolDependencies, ToolDependencies } from './tools/tool-context.js';
import { registerStudentTools } from './tools/student.tools.js';
import { registerAssignmentTools } from './tools/assignment.tools.js';
import { registerAttendanceTools } from './tools/attendance.tools.js';
import { registerProjectTools } from './tools/project.tools.js';
import { registerBatchTools } from './tools/batch.tools.js';
import { registerCourseTools } from './tools/course.tools.js';

export interface CreateServerOptions {
  name?: string;
  version?: string;
  /** Override the shared services; used by tests. */
  dependencies?: ToolDependencies;
}

export const SERVER_NAME = 'lms-mcp';
export const SERVER_VERSION = '0.1.0';

/**
 * Builds the MCP server and registers every tool.
 *
 * Tool registration order defines the order in which tools are advertised, so it is
 * grouped by domain to keep `tools/list` readable.
 */
export function createServer(options: CreateServerOptions = {}): McpServer {
  const deps = options.dependencies ?? createToolDependencies();

  const server = new McpServer(
    {
      name: options.name ?? SERVER_NAME,
      version: options.version ?? SERVER_VERSION,
    },
    {
      instructions:
        'Read-only access to Job Junction LMS data for the authenticated user. ' +
        'Every tool operates on the signed-in user\'s own records unless the user is a ' +
        'mentor, trainer or admin; identity is taken from the authenticated session and ' +
        'can never be supplied as a tool argument. There is no tool for raw database ' +
        'access. When a tool returns success: false, read error.code to decide whether to ' +
        'ask the user for a different id, tell them the data is not recorded yet, or ' +
        'report that the LMS is unavailable.',
    },
  );

  registerStudentTools(server, deps);
  registerAssignmentTools(server, deps);
  registerAttendanceTools(server, deps);
  registerProjectTools(server, deps);
  registerBatchTools(server, deps);
  registerCourseTools(server, deps);

  return server;
}

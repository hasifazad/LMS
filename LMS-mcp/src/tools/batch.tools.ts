import { z } from 'zod';
import { createToolHandler, assertObjectId, ToolDependencies, ToolSuccessPayload } from './tool-context.js';
import { toBatchSummary } from './normalizers.js';
import { notFound } from '../utils/errors.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Batch tools.
 *
 * A batch id is not sensitive by itself, but the tool is still role-checked: a student
 * may only read the batch they are enrolled in, while trainer/mentor/admin may read
 * any batch. That check is enforced by `AuthorizationService.assertResourceVisible`.
 */
export function registerBatchTools(server: McpServer, deps: ToolDependencies): void {
  server.registerTool(
    'get_batch_details',
    {
      title: 'Get batch details',
      description:
        'Returns one batch: name and code, schedule (days of week and start/end time), ' +
        'start and end dates, student count, assigned mentor and course. Requires a ' +
        'batch id. A student may only read the batch they are enrolled in; mentors, ' +
        'trainers and admins may read any batch. Use this when the user names a specific ' +
        'batch or asks about a batch schedule.',
      inputSchema: {
        batchId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, 'Must be a 24-character hexadecimal LMS id.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    createToolHandler(deps, 'get_batch_details', async (args, d): Promise<ToolSuccessPayload> => {
      const batchId = assertObjectId(String(args.batchId ?? ''), 'batchId');
      const user = await d.auth.resolve();
      const request = { user };
      await d.authorization.assertResourceVisible(user, 'batch', batchId, request);

      const batch = await d.lmsApi.getBatch(batchId, request);
      if (!batch) {
        throw notFound('No batch with that id exists.');
      }

      return { success: true, batch: toBatchSummary(batch) };
    }),
  );
}

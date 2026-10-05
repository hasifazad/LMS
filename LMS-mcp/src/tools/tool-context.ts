import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from '../utils/logger.js';
import { invalidInput, toToolErrorPayload } from '../utils/errors.js';
import { LmsApiService } from '../services/lms-api.service.js';
import { AuthContextService } from '../auth/user-context.js';
import { AuthorizationService } from '../auth/authorization.service.js';

/** Shared services every tool handler receives. */
export interface ToolDependencies {
  lmsApi: LmsApiService;
  auth: AuthContextService;
  authorization: AuthorizationService;
}

export function createToolDependencies(): ToolDependencies {
  const lmsApi = new LmsApiService();
  return {
    lmsApi,
    auth: new AuthContextService(),
    authorization: new AuthorizationService(lmsApi),
  };
}

/** Structured success payload returned by every tool. */
export interface ToolSuccessPayload {
  success: true;
  [key: string]: unknown;
}

export type ToolImplementation = (
  args: Record<string, unknown>,
  deps: ToolDependencies,
) => Promise<ToolSuccessPayload>;

let requestCounter = 0;

function nextRequestId(): string {
  requestCounter += 1;
  return `req-${requestCounter}`;
}

/**
 * Wraps a tool implementation with the cross-cutting concerns every tool needs:
 * a request id, error normalisation and JSON serialisation.
 *
 * Tool handlers never throw. Failures become `isError: true` results carrying the safe
 * `LmsMcpError` payload, so the model receives a usable message instead of a protocol
 * error or a stack trace.
 */
export function createToolHandler(deps: ToolDependencies, toolName: string, handler: ToolImplementation) {
  return async (args: Record<string, unknown>) => {
    const requestId = nextRequestId();
    const startedAt = Date.now();
    try {
      const payload = await handler(args, deps);
      logger.info(`tool ok ${toolName}`, { requestId, durationMs: Date.now() - startedAt });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload as Record<string, unknown>,
      };
    } catch (error) {
      const payload = toToolErrorPayload(error);
      logger.warn(`tool error ${toolName}`, {
        requestId,
        durationMs: Date.now() - startedAt,
        code: payload.error.code,
        detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      });
      return {
        isError: true,
        content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload as unknown as Record<string, unknown>,
      };
    }
  };
}

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

/** Rejects malformed ids locally so a bad argument never becomes an upstream request. */
export function assertObjectId(value: string, field: string): string {
  if (!OBJECT_ID.test(value)) {
    throw invalidInput(`"${field}" must be a 24-character hexadecimal LMS id.`);
  }
  return value;
}

export type { McpServer };

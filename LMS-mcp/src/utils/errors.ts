/**
 * MCP-safe error model.
 *
 * Everything an AI agent can observe goes through `LmsMcpError`. The class carries a
 * stable machine-readable `code` plus a message that is deliberately free of
 * infrastructure details: no stack traces, no database URIs, no JWTs, no upstream
 * response bodies. The full cause is written to stderr by the logger instead.
 */

export type LmsMcpErrorCode =
  | 'INVALID_INPUT'
  | 'AUTH_CONTEXT_MISSING'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'LMS_API_UNAVAILABLE'
  | 'LMS_API_ERROR'
  | 'INTERNAL_ERROR';

const SAFE_MESSAGES: Record<LmsMcpErrorCode, string> = {
  INVALID_INPUT: 'The provided arguments are not valid.',
  AUTH_CONTEXT_MISSING: 'No authenticated LMS user is associated with this request.',
  UNAUTHENTICATED: 'Authentication with the LMS API failed.',
  FORBIDDEN: 'You are not allowed to perform this action.',
  NOT_FOUND: 'The requested LMS resource was not found.',
  LMS_API_UNAVAILABLE: 'The LMS API is currently unavailable. Try again later.',
  LMS_API_ERROR: 'The LMS API returned an unexpected response.',
  INTERNAL_ERROR: 'An unexpected internal error occurred.',
};

export class LmsMcpError extends Error {
  readonly code: LmsMcpErrorCode;
  readonly status?: number;
  override readonly cause?: unknown;

  constructor(code: LmsMcpErrorCode, message?: string, options?: { status?: number; cause?: unknown }) {
    // Callers may pass a more specific but still safe message; the default is the
    // generic one so that an upstream message can never leak by accident.
    super(message ?? SAFE_MESSAGES[code]);
    this.name = 'LmsMcpError';
    this.code = code;
    if (options?.status !== undefined) this.status = options.status;
    if (options?.cause !== undefined) this.cause = options.cause;
  }
}

export const invalidInput = (message: string): LmsMcpError =>
  new LmsMcpError('INVALID_INPUT', message);

export const authContextMissing = (message: string): LmsMcpError =>
  new LmsMcpError('AUTH_CONTEXT_MISSING', message);

export const unauthenticated = (message: string): LmsMcpError =>
  new LmsMcpError('UNAUTHENTICATED', message);

export const forbidden = (message: string): LmsMcpError =>
  new LmsMcpError('FORBIDDEN', message);

export const notFound = (message: string): LmsMcpError =>
  new LmsMcpError('NOT_FOUND', message);

export const lmsApiUnavailable = (cause: unknown): LmsMcpError =>
  new LmsMcpError('LMS_API_UNAVAILABLE', undefined, { cause });

export const lmsApiError = (message: string, cause: unknown): LmsMcpError =>
  new LmsMcpError('LMS_API_ERROR', message, { cause });

/** Shape returned to the LLM for every failed tool call. */
export interface ToolErrorPayload {
  success: false;
  error: {
    code: LmsMcpErrorCode;
    message: string;
  };
}

/**
 * Normalises any thrown value into the safe payload shown to the model.
 * Unknown errors collapse to a generic message; details go to stderr only.
 */
export function toToolErrorPayload(error: unknown): ToolErrorPayload {
  if (error instanceof LmsMcpError) {
    return { success: false, error: { code: error.code, message: error.message } };
  }
  return { success: false, error: { code: 'INTERNAL_ERROR', message: SAFE_MESSAGES.INTERNAL_ERROR } };
}

/**
 * Logging helpers.
 *
 * The MCP server speaks the protocol over stdio, so **stdout is reserved for protocol
 * frames**. Every diagnostic message must go to stderr, otherwise a stray `console.log`
 * will corrupt the JSON-RPC stream and break the client connection.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const configuredLevel = (): LogLevel => {
  const raw = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
  return raw === 'debug' || raw === 'info' || raw === 'warn' || raw === 'error' ? raw : 'info';
};

function write(level: LogLevel, message: string, details?: unknown): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[configuredLevel()]) return;
  const line = `[lms-mcp] ${level.toUpperCase()} ${message}`;
  if (details === undefined) {
    process.stderr.write(`${line}\n`);
    return;
  }
  process.stderr.write(`${line} ${safeStringify(details)}\n`);
}

/**
 * Never let logging throw, and never let it print a raw `Error` object
 * (which would include a stack trace we do not want to surface).
 */
function safeStringify(details: unknown): string {
  if (details instanceof Error) return `${details.name}: ${details.message}`;
  try {
    return JSON.stringify(details);
  } catch {
    return String(details);
  }
}

export const logger = {
  debug: (message: string, details?: unknown) => write('debug', message, details),
  info: (message: string, details?: unknown) => write('info', message, details),
  warn: (message: string, details?: unknown) => write('warn', message, details),
  error: (message: string, details?: unknown) => write('error', message, details),
};

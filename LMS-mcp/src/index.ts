#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

/**
 * Process entry point: transport wiring only.
 *
 * The MCP protocol is spoken over stdio, so **stdout belongs to the protocol**.
 * `logger` writes to stderr exclusively, and nothing here may use `console.log`.
 *
 * To add an HTTP / SSE / streamable-HTTP transport later, keep it in its own module
 * and share `createServer()` from `src/server.ts`; no tool code needs to change.
 */
async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  const shutdown = (signal: string): void => {
    logger.info(`received ${signal}, shutting down`);
    void server.close().finally(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  await server.connect(transport);

  // Diagnostic only — stderr, never stdout.
  logger.info('lms-mcp ready', {
    lmsApiUrl: `${env.lmsApiUrl}${env.lmsApiBasePath}`,
    organizationId: env.organizationId,
    nodeEnv: env.nodeEnv,
    userContext: env.allowEnvUserContext
      ? 'request resolver + development environment fallback'
      : 'request resolver only',
  });
}

main().catch((error: unknown) => {
  logger.error('failed to start lms-mcp', error);
  process.exit(1);
});

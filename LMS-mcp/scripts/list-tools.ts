/**
 * Developer utility: lists the tools this server advertises, without needing an MCP
 * client. Run with `npm run inspect:tools`.
 *
 * It starts the real server over stdio and speaks MCP to it, so it also proves the
 * transport is wired correctly.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const serverEntry = resolve(projectRoot, 'src', 'index.ts');

/** Run the TypeScript entry point through the local tsx CLI. */
const tsxCli = fileURLToPath(
  new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url),
);

async function main(): Promise<void> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [tsxCli, serverEntry],
    cwd: projectRoot,
    env: Object.fromEntries(
      Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
    ),
    stderr: 'inherit',
  });

  const client = new Client({ name: 'lms-mcp-inspector', version: '0.1.0' });
  await client.connect(transport);

  const { tools } = await client.listTools();
  const version = client.getServerVersion();

  process.stderr.write(`\nserver: ${version?.name ?? 'unknown'} v${version?.version ?? '?'}\n`);
  process.stderr.write(`tools: ${tools.length}\n\n`);

  for (const tool of tools) {
    const required = (tool.inputSchema.required as string[] | undefined) ?? [];
    const properties = Object.keys((tool.inputSchema.properties as object | undefined) ?? {});
    const args = required.length > 0 ? ` args(${required.join(', ')})` : ' args(none)';
    process.stderr.write(`  ${tool.name}${args}\n`);
    if (properties.length > 0) process.stderr.write(`      properties: ${properties.join(', ')}\n`);
    process.stderr.write(`      ${tool.description}\n\n`);
  }

  await client.close();
}

main().catch((error: unknown) => {
  process.stderr.write(`inspect failed: ${String(error)}\n`);
  process.exit(1);
});

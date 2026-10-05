/**
 * Terminal test harness for the MCP server.
 *
 * Starts a real MCP server over stdio, performs the MCP handshake, calls one tool and
 * prints the result. This exercises the same code path an AI client would use.
 *
 *   npm run call -- get_my_profile
 *   npm run call -- get_batch_details '{"batchId":"6ab3993e88f26b3806b3ddd3"}'
 *
 * Flags let you test the auth/authorization boundary without editing `.env`:
 *
 *   --as <userId>    override LMS_MCP_USER_ID
 *   --role <role>    student | trainer | mentor | admin
 *   --url <origin>   override LMS_API_URL
 *   --org <code>     override LMS_ORGANIZATION_ID
 *   --env-context    force the development identity fallback off
 *   --tools          just list the advertised tools
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const tsxCli = fileURLToPath(new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url));
const serverEntry = resolve(projectRoot, 'src', 'index.ts');

interface CliOptions {
  env: Record<string, string>;
  tool?: string;
  args: Record<string, unknown>;
  listOnly: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const env: Record<string, string> = {};
  const positional: string[] = [];
  let listOnly = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case '--as':
        env.LMS_MCP_USER_ID = next ?? '';
        i += 1;
        break;
      case '--role':
        env.LMS_MCP_USER_ROLE = next ?? '';
        i += 1;
        break;
      case '--url':
        env.LMS_API_URL = next ?? '';
        i += 1;
        break;
      case '--org':
        env.LMS_ORGANIZATION_ID = next ?? '';
        i += 1;
        break;
      case '--env-context':
        env.LMS_MCP_ALLOW_ENV_USER_CONTEXT = 'false';
        break;
      case '--tools':
        listOnly = true;
        break;
      default:
        if (arg !== undefined) positional.push(arg);
    }
  }

  let args: Record<string, unknown> = {};
  const json = positional[1];
  if (json) {
    try {
      args = JSON.parse(json) as Record<string, unknown>;
    } catch {
      throw new Error(`Tool arguments must be valid JSON. Received: ${json}`);
    }
  }

  return { env, tool: positional[0], args, listOnly };
}

function out(message: string): void {
  process.stdout.write(`${message}\n`);
}

async function main(): Promise<void> {
  const { env, tool, args, listOnly } = parseArgs(process.argv.slice(2));

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [tsxCli, serverEntry],
    cwd: projectRoot,
    env: Object.fromEntries(
      Object.entries({ ...process.env, ...env }).filter(
        (entry): entry is [string, string] => entry[1] !== undefined,
      ),
    ),
    stderr: 'inherit',
  });

  const client = new Client({ name: 'lms-mcp-cli', version: '0.1.0' });
  await client.connect(transport);

  const { tools } = await client.listTools();
  out(`tools (${tools.length}): ${tools.map((t) => t.name).join(', ')}`);

  if (listOnly) {
    await client.close();
    return;
  }

  if (!tool) {
    out('\nPass a tool name, e.g. npm run call -- get_my_profile');
    await client.close();
    process.exitCode = 1;
    return;
  }

  if (!tools.some((t) => t.name === tool)) {
    out(`\nUnknown tool "${tool}".`);
    await client.close();
    process.exitCode = 1;
    return;
  }

  out(`\ncalling ${tool} ${JSON.stringify(args)} ...\n`);
  const result = await client.callTool({ name: tool, arguments: args });

  const content = Array.isArray(result.content) ? result.content : [];
  const text = content
    .map((part) => {
      const typed = part as { type?: string; text?: string };
      return typed.type === 'text' ? (typed.text ?? '') : `<${typed.type ?? 'unknown'}>`;
    })
    .join('\n');

  out(text);
  out(`\nisError: ${result.isError === true}`);

  await client.close();
  if (result.isError === true) process.exitCode = 1;
}

main().catch((error: unknown) => {
  process.stdout.write(`\nfailed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});

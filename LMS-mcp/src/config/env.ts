import { config as loadDotenv } from 'dotenv';

loadDotenv();

export type NodeEnv = 'development' | 'test' | 'production';

export interface LmsMcpEnv {
  nodeEnv: NodeEnv;
  /** Origin of the LMS-server Express API, e.g. "http://localhost:3000". No trailing slash. */
  lmsApiUrl: string;
  /** Base path the LMS-server mounts its REST API under. */
  lmsApiBasePath: string;
  /** Value sent as the `x-organization-id` header (multi-organisation routing in LMS-server). */
  organizationId: string;
  /** Request timeout for outbound LMS API calls, in milliseconds. */
  requestTimeoutMs: number;
  /**
   * Development-only fallback identity.
   *
   * The MCP server must never accept a user id from the model. In local development
   * there is no authenticated LMS session to read yet, so the identity is taken from the
   * environment. This is disabled by default outside development.
   */
  devUserId?: string;
  devUserRole?: string;
  devUserEmail?: string;
  /** Optional bearer token forwarded to the LMS API when the LMS server actually enforces it. */
  lmsSessionToken?: string;
  /** Whether the environment-based identity fallback may be used. Defaults to true in development only. */
  allowEnvUserContext: boolean;
}

const DEFAULT_TIMEOUT_MS = 10_000;

function readString(name: string): string | undefined {
  const raw = process.env[name];
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const raw = readString(name);
  if (raw === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

function readNodeEnv(): NodeEnv {
  const raw = readString('NODE_ENV')?.toLowerCase();
  if (raw === 'production' || raw === 'test') return raw;
  return 'development';
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function stripSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

function loadEnv(): LmsMcpEnv {
  const nodeEnv = readNodeEnv();

  const lmsApiUrl = stripTrailingSlash(
    readString('LMS_API_URL') ?? 'http://localhost:3000',
  );

  const lmsApiBasePath = `/${stripSlashes(readString('LMS_API_BASE_PATH') ?? 'api/v1')}`;

  const env: LmsMcpEnv = {
    nodeEnv,
    lmsApiUrl,
    lmsApiBasePath,
    organizationId: readString('LMS_ORGANIZATION_ID') ?? 'org1db',
    requestTimeoutMs: Number(readString('LMS_API_TIMEOUT_MS') ?? '') || DEFAULT_TIMEOUT_MS,
    allowEnvUserContext: readBoolean('LMS_MCP_ALLOW_ENV_USER_CONTEXT', nodeEnv !== 'production'),
  };

  const devUserId = readString('LMS_MCP_USER_ID');
  if (devUserId !== undefined) env.devUserId = devUserId;

  const devUserRole = readString('LMS_MCP_USER_ROLE');
  if (devUserRole !== undefined) env.devUserRole = devUserRole.toLowerCase();

  const devUserEmail = readString('LMS_MCP_USER_EMAIL');
  if (devUserEmail !== undefined) env.devUserEmail = devUserEmail;

  const lmsSessionToken = readString('LMS_MCP_SESSION_TOKEN');
  if (lmsSessionToken !== undefined) env.lmsSessionToken = lmsSessionToken;

  return env;
}

export const env: LmsMcpEnv = loadEnv();

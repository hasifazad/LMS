import { env } from '../config/env.js';
import { authContextMissing, LmsMcpError } from '../utils/errors.js';

/**
 * Authenticated-user context.
 *
 * Every "my ..." tool resolves its subject from this object. The object is never
 * derived from tool arguments, so the model cannot ask for another student's data.
 *
 * ## Where the authenticated user is injected
 *
 * Today the MCP server runs over stdio, which carries no user session. A resolver
 * therefore has to supply the identity from somewhere trustworthy:
 *
 * 1. **Production / chatbot integration (not wired yet).** The host chatbot
 *    authenticates the LMS user, then starts or calls this MCP server. The
 *    `UserContextResolver` is the single seam: implement
 *    `createRequestUserContextResolver()` (or a JWKS-backed variant) to read the
 *    verified LMS user from the incoming request / MCP session and return a
 *    `UserContext`. No tool code changes are required.
 * 2. **Local development (wired).** `createEnvUserContextResolver()` reads a fixed
 *    identity from environment variables. It is refused unless
 *    `allowEnvUserContext` is true, which is never the case in production.
 *
 * 3. **A third option — delegated token.** The chatbot passes the *already
 *    authenticated* LMS session token with each tool call and the resolver
 *    forwards it upstream. `LmsSessionTokenSource` is the seam for that; it is not
 *    populated in this first iteration.
 */

export type UserRole = 'student' | 'trainer' | 'mentor' | 'admin';

const USER_ROLES: readonly UserRole[] = ['student', 'trainer', 'mentor', 'admin'];

/** Everything the tools are allowed to know about the caller. */
export interface UserContext {
  /** LMS user id: a `Student._id` for students, a `Trainer._id` for staff. */
  readonly userId: string;
  readonly role: UserRole;
  /** Present for staff; the LMS trainer login is email-based. */
  readonly email?: string;
  /** Organisation the caller belongs to. Used to scope LMS API calls. */
  readonly organizationId?: string;
  /**
   * Optional upstream session token forwarded to the LMS API.
   *
   * Note: `LMS-server` currently enforces JWT only on `GET /api/v1/trainer/validate`,
   * so this is currently unused for the read tools. It exists so that enabling
   * server-side enforcement later does not require a redesign.
   */
  readonly sessionToken?: string;
}

/** Per-request ambient state available to a resolver. */
export interface AuthResolutionContext {
  /** Identifies the current tool call, for logging only. Never used for authorization. */
  readonly requestId?: string;
  /** Transport-specific metadata, e.g. HTTP headers, once an HTTP transport is added. */
  readonly transport?: Record<string, unknown>;
}

export interface UserContextResolver {
  readonly name: string;
  resolve(context: AuthResolutionContext): Promise<UserContext>;
}

/** Injection point for an authenticated LMS session token. Not wired yet. */
export interface LmsSessionTokenSource {
  getToken(context: AuthResolutionContext): Promise<string | undefined>;
}

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

function omitUndefined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T;
}

/**
 * Development-only resolver. Reads the identity from the environment so a single
 * local MCP process can exercise the tools without a chatbot in the loop.
 */
export function createEnvUserContextResolver(): UserContextResolver {
  return {
    name: 'env',
    async resolve(): Promise<UserContext> {
      const userId = env.devUserId;
      if (!userId) {
        throw authContextMissing(
          'No LMS user is bound to this MCP server. Set LMS_MCP_USER_ID (development only), ' +
            'or wire an authenticated user context resolver.',
        );
      }

      const role = env.devUserRole ?? 'student';
      if (!isUserRole(role)) {
        throw new LmsMcpError(
          'AUTH_CONTEXT_MISSING',
          `LMS_MCP_USER_ROLE must be one of: ${USER_ROLES.join(', ')}.`,
        );
      }

      return omitUndefined({
        userId,
        role,
        email: env.devUserEmail,
        organizationId: env.organizationId,
        sessionToken: env.lmsSessionToken,
      });
    },
  };
}

/**
 * Placeholder for the real integration point: derive the user from a verified LMS
 * session carried by the transport. It fails closed until implemented.
 */
export function createRequestUserContextResolver(): UserContextResolver {
  return {
    name: 'request',
    async resolve(): Promise<UserContext> {
      throw authContextMissing(
        'Request-scoped LMS authentication is not implemented yet. ' +
          'Implement UserContextResolver in src/auth/user-context.ts to read the authenticated user.',
      );
    },
  };
}

export interface AuthContextServiceOptions {
  /** Preferred resolver, tried first. */
  primary?: UserContextResolver;
  /** Development fallback; only used when `env.allowEnvUserContext` is true. */
  fallback?: UserContextResolver;
}

/**
 * Resolves the caller for a tool call.
 *
 * Order: primary resolver, then (in development only) the environment fallback.
 * A failure of the primary resolver is logged but not fatal while a fallback exists,
 * so the caller still gets a safe error if the fallback also cannot resolve.
 */
export class AuthContextService {
  private readonly primary: UserContextResolver;
  private readonly fallback?: UserContextResolver;

  constructor(options: AuthContextServiceOptions = {}) {
    this.primary = options.primary ?? createRequestUserContextResolver();
    this.fallback = env.allowEnvUserContext
      ? (options.fallback ?? createEnvUserContextResolver())
      : options.fallback;
  }

  get resolvers(): string[] {
    return this.fallback ? [this.primary.name, this.fallback.name] : [this.primary.name];
  }

  async resolve(context: AuthResolutionContext = {}): Promise<UserContext> {
    try {
      return await this.primary.resolve(context);
    } catch (error) {
      if (!this.fallback) throw error;
    }

    if (!this.fallback) {
      throw authContextMissing('No LMS user context resolver is configured.');
    }
    return this.fallback.resolve(context);
  }
}

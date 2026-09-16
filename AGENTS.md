# LMS Repository Guide

## Overview

This repository contains the Job Junction Learning Management System (LMS). It has three independent Node.js applications; there is no root `package.json` or workspace command.

| Directory | Purpose | Stack |
| --- | --- | --- |
| `LMS-server` | Versioned REST API | Node.js, Express 4, MongoDB/Mongoose, CommonJS JavaScript |
| `LMS-client` | Student and trainer portal | React 18, TypeScript, Vite, Tailwind, Redux Toolkit |
| `LMS-admin` | Administration portal | React 18, TypeScript, Vite, Tailwind, Zustand |
| `docs` | Project documentation | Markdown |

The API is mounted below `/api/v1`. Main domains are `organisation`, `staff`, `student`, `batch`, `course`, and `admin`.

## Working in the Repository

- Make changes in the app that owns the feature. A change to an API contract usually requires updating the relevant frontend service/call site as well.
- Preserve existing local edits. This repository may contain uncommitted work from another contributor.
- Do not commit build output, `node_modules`, logs, `.env` files, or credentials. They are ignored by the repository.
- Never place secrets, connection strings, SMTP credentials, JWT secrets, Cloudinary keys, or production URLs in source or documentation.
- Prefer focused changes; do not reformat unrelated files or replace established application patterns during a feature fix.

## Local Development

Use a separate terminal for each application. Install dependencies in the application directory first.

```powershell
cd LMS-server; npm install; npm run dev
cd LMS-client; npm install; npm run dev
cd LMS-admin; npm install; npm run dev
```

The server listens on `PORT` or port `3001`. It needs a reachable MongoDB instance; avoid starting it merely for a frontend-only change unless the API is needed.

Frontend environment variables:

- `LMS-client`: `VITE_BASE_URL` is the backend origin. Its Axios client adds `/api/v1` and sends an `x-organization-id` header.
- `LMS-admin`: `VITE_API_URL` is the backend origin. Its Axios client adds `/api/v1/`.

Keep local values in ignored `.env` files. Ensure new `VITE_*` variables are documented in `docs/setup.md` without adding their real values.

## Code Conventions

### Backend (`LMS-server`)

- Use CommonJS (`require` / `module.exports`) and JavaScript; do not introduce ESM or TypeScript in isolated changes.
- Keep the request flow consistent: route -> middleware -> controller -> Mongoose model.
- Put route definitions in `src/routes`, HTTP handling in `src/controllers`, schemas in `src/models`, and reusable request concerns in `src/middlewares`.
- Keep API routes under `/api/v1` and avoid moving the organisation route before understanding the ordering in `src/server.js`: organisation routes are registered before the database middleware.
- Validate user-controlled input with the existing validation/middleware patterns. Return appropriate status codes and the established JSON response shape.
- Do not hard-code organisation database names, URLs, ports, or credentials. Preserve multi-organisation behavior through the database middleware and request context.

### Frontends (`LMS-client`, `LMS-admin`)

- Use TypeScript and functional React components. Keep page-level screens in `src/pages`, routes in `src/routes`, and shared UI in `src/components`.
- Use the application’s current state pattern: Redux Toolkit in `LMS-client`; Zustand/local component state in `LMS-admin`.
- Reuse each app’s configured Axios instance (`LMS-client/src/axios/fetchData.ts` or `LMS-admin/src/services/api.ts`) instead of creating ad-hoc API clients.
- Keep UI responsive and retain existing loading, error, authentication, and role-protection behavior when modifying routes or data fetching.
- Follow existing Tailwind/CSS conventions and reuse existing components/assets where appropriate.

## Validation

Run checks from the affected application directory:

```powershell
# LMS-client or LMS-admin
npm run lint
npm run build

# LMS-server
npm run build
```

The frontend build runs TypeScript checking followed by a Vite production build. The backend’s build script invokes `tsc`, but the current server source is JavaScript and its TypeScript configuration is largely commented out; use targeted runtime/API checks when changing backend behavior.

For a full feature spanning applications, verify:

1. The affected frontend builds and lints cleanly.
2. The changed API endpoint works with a local MongoDB instance and expected organisation context.
3. Relevant student, trainer, and admin flows still respect authentication and role boundaries.

## Documentation

- Update `docs/api.md` when endpoint paths or API contracts change.
- Update `docs/setup.md` for required setup or environment-variable changes.
- Update `docs/architecture.md` when application boundaries or integration flow changes.

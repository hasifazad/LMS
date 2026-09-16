# API Overview

The backend exposes versioned REST endpoints under `/api/v1`.

| Domain | Base path |
| --- | --- |
| Organisation | `/organisation` |
| Staff | `/staff` |
| Student | `/student` |
| Batch | `/batch` |
| Course | `/course` |
| Admin | `/admin` |

Refer to the route and controller files in `LMS-server/src` for request and response details. Protected endpoints require the JWT authentication credentials configured by the backend.

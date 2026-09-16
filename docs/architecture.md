# Architecture

The repository contains three applications:

- `LMS-server`: Express and MongoDB REST API.
- `LMS-client`: React application for students and trainers.
- `LMS-admin`: React application for administrative users.

Both frontend applications call the backend under `/api/v1`. The backend groups endpoints by organisation, staff, student, batch, course, and admin domains. Authentication is JWT-based, while uploaded files are handled through Multer and Cloudinary.

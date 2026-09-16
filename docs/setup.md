# Local Setup

## Prerequisites

Install Node.js 18+, npm, and have access to a MongoDB database.

## Backend

1. In `LMS-server`, install dependencies with `npm install`.
2. Create a `.env` file with the MongoDB, JWT, Cloudinary, SMTP, and CORS values used by your environment.
3. Start the API with `npm run dev`.

## Student and trainer client

1. In `LMS-client`, install dependencies with `npm install`.
2. Set `VITE_BASE_URL` to the backend origin.
3. Start the app with `npm run dev`.

## Admin client

1. In `LMS-admin`, install dependencies with `npm install`.
2. Set `VITE_API_URL` to the backend origin.
3. Start the app with `npm run dev`.

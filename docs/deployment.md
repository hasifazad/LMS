# Deployment

Deploy the API, student/trainer client, and admin client as separate services.

1. Set production environment variables for each application.
2. Deploy `LMS-server` with the `npm start` command and a reachable MongoDB instance.
3. Build each Vite frontend with `npm run build` and host its generated static assets.
4. Configure the frontend API URL variables to point to the deployed backend.
5. Restrict backend CORS to the deployed frontend origins.

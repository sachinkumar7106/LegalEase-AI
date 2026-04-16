# LegalEase AI

LegalEase AI is a React + Vite app with an Express/MongoDB backend for legal document analysis and account-based access.

## Setup

1. Install dependencies in the app root and the backend:

```bash
npm install
cd server
npm install
```

2. Set environment variables:

- `LegalEaseAI/.env` should include `MONGO_URI`, `GEMINI_API_KEY`, and optionally `PORT`.
- `LegalEaseAI/server/.env` can also include `GEMINI_API_KEY` or `AUTH_SECRET` if you want a separate server-only override.

3. Start the backend from `LegalEaseAI/server`:

```bash
node index.js
```

4. Start the frontend from `LegalEaseAI`:

```bash
npm run dev
```

## Auth

- Use the sign-up form to create a new user.
- New accounts are saved in MongoDB in the `users` collection.
- Sign-in uses the same backend and returns a token that is stored locally in the browser.

# People Pulse HRMS

This repository contains the People Pulse HRMS app (frontend in `client/`, backend in `server/`).

## Environment variables

- Copy `.env.example` to `.env` and populate real API keys and settings.
- The `.env` file is ignored by git; do not commit secrets.
- Example variables in `.env.example`: `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `PORT`.

If you accidentally committed an `.env` file already, follow the untrack steps below.

## Removing a tracked `.env` (if needed)

Run these commands to remove `.env` from git tracking and commit the change:

```bash
git rm --cached .env || true
git rm --cached server/.env || true
git rm --cached client/.env || true
git add .gitignore .env.example README.md
git commit -m "Ignore environment files and add example"
git push
```

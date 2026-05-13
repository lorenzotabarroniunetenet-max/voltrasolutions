# Voltra Frontend v2

Pure trade copier UI. React + Vite + Tailwind + React Router.

## Setup

1. Set backend URL in `.env`:
   ```
   VITE_API_URL=https://voltra-backend-m4q8.onrender.com
   ```
2. Install & run:
   ```
   npm install
   npm run dev      # local dev
   npm run build    # production build → dist/
   ```

## Deploy on Cloudflare Pages

Build: `npm run build` · Output: `dist`

Set env var `VITE_API_URL` in Cloudflare Pages settings.

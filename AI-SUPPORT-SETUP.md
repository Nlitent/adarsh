# Adarsh Electricals — AI Support & Enquiry Capture

This package adds a bilingual (English/Hindi-Hinglish) support widget to the existing static website, plus a separate secure Node.js API for AI responses, lead storage, email alerts and an admin dashboard. Existing page copy and images are not intentionally changed.

## What works immediately
- The floating support widget appears on all six HTML pages.
- Chat and enquiry form are bilingual-friendly.
- Contact links work even before the backend is configured.
- The widget clearly tells visitors that online support/enquiry submission is not active until a backend URL is configured; it does not pretend that an enquiry was saved.

## Production setup required
GitHub Pages hosts static files only. The backend must be deployed separately to a Node.js host (for example Render, Railway, or another trusted provider). Do not put API keys in `support-config.js` or any browser code.

### 1. Create the database
1. Create a Supabase project.
2. Open SQL Editor and run `backend/schema.sql`.
3. In your backend host's secret/environment settings, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The service-role key is secret; never publish it.

### 2. Configure backend secrets
1. Deploy the `backend` folder as a Node.js service using `npm install` and `npm start`.
2. Add the variables listed in `backend/.env.example` as environment secrets on the host.
3. Set `ALLOWED_ORIGINS=https://nlitent.github.io` (add your custom domain too if you use one).
4. Set a long unique `ADMIN_PASSWORD` and a separate random `ADMIN_SESSION_SECRET`. Do not reuse account passwords.
5. For AI chat, add an OpenAI API key and confirm billing/usage limits on your API account.
6. For email alerts, add a Resend API key and use a verified sender domain/address in `FROM_EMAIL`; configure `NOTIFY_EMAIL` as the business inbox. Without email credentials, enquiries can still save but notification will not send.

### 3. Connect website to backend
Edit `support-config.js` and set `apiBaseUrl` to your deployed API's HTTPS base URL, without a trailing slash. Example: `apiBaseUrl: "https://your-service.example.com"`. Commit and push the updated website files to GitHub.

### 4. Admin dashboard
Open `https://YOUR-BACKEND-DOMAIN/admin` and sign in with `ADMIN_PASSWORD`. Keep the dashboard URL and password private. The dashboard lists enquiries and allows status updates. Use HTTPS in production.

### 5. Test before launch
- Visit `/api/health` on the backend; check `configured: true`.
- Test AI chat in English and Hindi/Hinglish.
- Submit a test enquiry and confirm it appears in Supabase.
- Confirm email reaches the business inbox (check spam too).
- Sign in to `/admin`, change a test lead status, and verify it persists.
- Test mobile layout and all original page links.

## Important limitations / security
- The AI assistant gives general product information and must not invent pricing, certifications, or technical specifications. Human review is needed for quotations and safety-critical requests.
- Enquiry data includes personal information. Limit access, use strong secrets, and define a retention policy. The dashboard is a basic password-protected starter, not a substitute for a full enterprise identity/access system. Add stronger admin protections and monitoring before high-volume production use.
- This package is prepared but not deployed. Live AI, database storage, and email alerts will not operate until the backend and its secrets are configured.
- No secrets should ever be committed to GitHub. If a secret was accidentally exposed, rotate it immediately.

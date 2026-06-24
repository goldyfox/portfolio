# Archived contact API

`contact-route.ts` is the former `app/api/contact/route.ts` (Resend + rate limiting).

**DreamHost shared hosting** uses static export and **Formspree** instead — see `env.deploy.example`.

If you move to VPS or Vercel later, restore this as `app/api/contact/route.ts` and switch the contact page back to `fetch("/api/contact", ...)`.

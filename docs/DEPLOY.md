# Deploy runbook

## Project

- **Firebase project ID:** `bookatlas-13392` (Spark plan, no credit card)
- **Live URLs:** https://bookatlas-13392.web.app and https://bookatlas-13392.firebaseapp.com
- **Dev/emulator project:** `bookatlas-dev` (alias `dev` in `.firebaserc`)

## One-time Console setup

### 1. Authentication → Sign-in method

Enable these providers:

- **Email/Password** — toggle on. Email-link auth is the passwordless flow.
- **Google** — toggle on; provide a support email; OAuth client is auto-created.
- **GitHub** — *currently disabled*. To enable later: create OAuth app at
  github.com/settings/developers with callback
  `https://bookatlas-13392.firebaseapp.com/__/auth/handler`, paste the
  Client ID + Secret in the Firebase Console.

### 2. Authentication → Settings → Authorized domains

Verify these are present (defaults cover most):

- `localhost`
- `bookatlas-13392.web.app`
- `bookatlas-13392.firebaseapp.com`

Add any custom domain you wire up.

### 3. Firestore

Create the native database in production mode (location: `nam5` for US,
`eur3` for EU). Rules and indexes are deployed automatically by CI.

### 4. App Check

1. In the Firebase Console → **App Check** → **Apps** → register the
   reCAPTCHA v3 provider.
2. Site key: `6Lf8JAstAAAAAKwTr7tf2x5eYezy5zvYDBfGU0v9`
   (registered at https://www.google.com/recaptcha/admin/create for
   domains `bookatlas-13392.web.app`, `bookatlas-13392.firebaseapp.com`,
   `localhost`).
3. **Enforcement**: toggle on for **Authentication** and **Firestore**.
   Wait ~15 minutes for telemetry to populate before enforcing.

### 5. Custom domain (optional)

Firebase Console → **Hosting** → **Add custom domain**. Spark plan
supports custom domains for free; you'll need to add the DNS records
Firebase prints at your registrar.

## CI / GitHub secrets

Set in repo Settings → Secrets and variables → Actions:

| Secret | Source |
| --- | --- |
| `PUBLIC_FIREBASE_API_KEY` | `firebaseConfig.apiKey` |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | `bookatlas-13392.firebaseapp.com` |
| `PUBLIC_FIREBASE_PROJECT_ID` | `bookatlas-13392` |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | `bookatlas-13392.firebasestorage.app` |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from the Firebase web app config |
| `PUBLIC_FIREBASE_APP_ID` | from the Firebase web app config |
| `PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-LJ4K9P1MHK` |
| `PUBLIC_RECAPTCHA_V3_SITE_KEY` | `6Lf8JAstAAAAAKwTr7tf2x5eYezy5zvYDBfGU0v9` |
| `FIREBASE_SERVICE_ACCOUNT` | JSON key from Firebase Console → Project Settings → Service Accounts → Generate new private key |

For the book-automation pipeline (issue → PR):

| Secret | Purpose |
| --- | --- |
| `GROQ_API_KEY` | primary cheap LLM in the waterfall |
| `OPENAI_API_KEY` | fallback |
| `OPENROUTER_API_KEY` | fallback (uses Claude 3.5 Sonnet) |
| `GEMINI_API_KEY` | fallback |

The waterfall tries each provider in order; only one key is required for
the pipeline to run.

## Local commands

```sh
pnpm install
pnpm typecheck
pnpm build

# Emulators (auth + firestore + hosting)
pnpm emulators
# in another shell, with web/.env.local pointing to bookatlas-dev
pnpm dev

# Deploy to production (rules + indexes + hosting)
firebase use bookatlas-13392
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only hosting

# Smoke test live
node scripts/post-deploy-smoke.cjs
```

## Rotation

- **Service account JSON**: regenerate in Console, update
  `FIREBASE_SERVICE_ACCOUNT` secret, no code change.
- **reCAPTCHA site key**: register a new key, update the public env var
  + secret, redeploy.
- **Firebase web config**: rotate by creating a new web app in the
  Console, copy values into the public env vars, redeploy.

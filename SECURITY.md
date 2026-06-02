# Security Policy

BookAtlas is a free platform that runs on the **Firebase Spark** (free)
plan, hosted on **Firebase Hosting**, with **Firestore** for user data.
We are deliberate about what we expose.

## Reporting a vulnerability

Please email **chirag127+security@…** or open a private
[advisory](https://github.com/chirag127/BookAtlas/security/advisories/new).
We respond within 7 days. Please do not file a public issue for
vulnerabilities.

## What we protect

- **User data** (notes, reviews, bookmarks, collections, reading
  progress, settings) is isolated by `users/{uid}` and protected by
  `firestore.rules`. Every rule denies by default and only allows the
  owner to read/write.
- **Public mirrors** (`publicReviews`, `publicCollections`) are readable
  by anyone but only writable by the owner.
- **No secrets in the repo.** LLM API keys live in GitHub Secrets and
  are referenced by name (`apiKeyEnv`) in `models.llm.models.json`.
- **Strict response headers** on the host: `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` denies geolocation/microphone/camera.
- **Content Security Policy** is set in `web/src/layouts/BaseLayout.astro`
  meta tags; production deployments should add a CSP via
  Firebase Hosting headers.

## Threat model assumptions

We assume:

- The **GitHub repo is public** (required for free Actions minutes).
- The **Firebase project** is on the Spark plan; no Blaze features are
  used.
- The **LLM providers** are third-party services that may have outages.
  The waterfall design means a single failure is non-fatal.
- The **browser** is up to date. The narration player uses standard
  `SpeechSynthesis` (Baseline Widely Available).
- **Covers** come from Open Library's CDN. We display them as `<img>`
  and trust their content moderation.

## What we do not do

- We do not run server-side code (no Cloud Functions / Cloud Run).
- We do not store user-uploaded files (no Cloud Storage).
- We do not generate or store audio (no MP3s).
- We do not require a credit card for any feature.

## Dependencies

We run `pnpm audit` in CI on every PR. We use Dependabot weekly updates
for `pnpm` and `github-actions` ecosystems. Critical advisories are
patched within 24 hours of disclosure.

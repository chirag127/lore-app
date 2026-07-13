# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| latest (main) | Yes |

## Scope

Lore is a static knowledge-summary site (Astro + Cloudflare Pages). It holds no user credentials, payment data, or secrets. Client-side only — no auth, no database, no server-side user data.

Relevant attack surfaces: XSS in MDX content rendering, dependency supply-chain issues, misconfigured CSP headers.

## Reporting a vulnerability

Do NOT open a public GitHub issue for security problems.

Use **GitHub Security Advisories** (private):
1. Go to <https://github.com/chirag127/lore/security/advisories/new>
2. Describe the issue, steps to reproduce, and impact.

Alternatively email or DM chirag127 directly via GitHub. Expect a response within 72 hours. Please allow reasonable time to patch before public disclosure.

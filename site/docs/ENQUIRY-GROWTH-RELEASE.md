# Organiya Now–P2 release — 12 November 2026

Scope: existing independent Option O website and its existing inquiry Worker. No production Spicenza/MarketLift changes, paid subscriptions, plan upgrades, MX/DNS changes or old-site deletion.

## Delivered in this release

- Public-email cleanup and shared readable typography retained.
- One content-configured form with seven purposes; product scope supports whole range, several products, an unlisted product, none or unsure. Only relevant optional fields are shown. Product-source context is separate from declared interest. General navigation no longer assumes Chia.
- Plain Indian English across introductions, navigation, actions and business pages. Upcoming-product status, illustrative image notices and the Organiya/Spicenza roles remain explicit.
- Server validation, fixed recipient, Turnstile, request-size cap, phone/interest/purpose validation and backward compatibility with the old form.
- Rate limiting and a SQLite Durable Object for atomic quota reservations, duplicate suppression and uncertain-send handling. No customer-content database.
- Structured notification emails with a reference and an importable lead record. Visitor email addresses remain unverified; no visitor-address autoresponder.
- Minimal attribution attached only to submissions: allowlisted site paths, CTA, source product and recognised campaign codes, plus a broad referrer group. No GPS, inferred location, raw-IP lead storage, cookies, fingerprinting or separate funnel-event requests.
- Offline private lead register/dashboard: manual import, ownership, follow-up, actual outcomes, qualification, exclusions, response times, product/territory/source counts, private export and retention review. Source application is under operations/ and excluded from dist/.

## Cost controls and exact thresholds

Cloudflare dashboard was checked: Workers account and Organiya zone are Free. No upgrade was selected. The official CLI was authorised by the owner with account/user/zone read and Worker script/route write access; no billing-write or DNS-write scope was requested.

| Control | Setting | Enforcement |
| --- | --- | --- |
| Free WAF burst rule | 10 requests/IP/10 seconds; block 10 seconds; path exactly /api/inquiry | Active rule 8600663e06214450bdd3ac784e9daf03; formerly unused 0/1 slot |
| Worker short window | 5 POST attempts/IP/60 seconds | Approximate per Cloudflare location; not a global quota |
| Valid submissions/IP | 10 rolling hour | Shared atomic counter |
| Global notification attempts | 25 rolling hour; 100 rolling 24 hours | Reserve before sending; failed/uncertain attempts consume quota |
| Advisory email repetition | More than 3/hour | Review signal, never the sole hard block |
| Idempotency | Same ID/body: 24 hours; same email/purpose/message: 10 minutes | No automatic repeat after uncertain delivery |
| Capacity warning | 20/hour or 80/day | Sanitised Worker warning and next notification email; manual kill switch DISABLE_SEND=true |
| Storage | Keyed identifiers/status only; expiry 24h, scheduled physical cleanup within 48h | Small bounded SQLite table; no raw IP, email, name or body |
| Other boundaries | 24,000-byte request; 4,000-character message; six selected product IDs max | No attachments, background jobs, unbounded queue or automatic email replies |

The new counter runs only after valid field and Turnstile checks. No paid KV, CRM, analytics service or automatic upgrade is needed. Free quotas are account-wide and finite; abuse can still exhaust availability. On Free, excess operations fail rather than create usage overage charges. Do not upgrade to Paid automatically. Operational provider logs have their own policies; the application TTL does not delete provider logs.

## Deployment and rollback

Static site: PR to codex/organiya-launch → GitHub checks → Cloudflare preview → merge. Worker: deploy the same reviewed source with Wrangler 4.160.1, preserving existing EMAIL, INQUIRY_TO and TURNSTILE_SECRET. The new ABUSE_KEY is an encrypted random secret, not in Git. Deploy the compatible Worker before merging the new form.

Previous Worker version: 77ef8e3f-6584-4d40-a645-6b898717e8c8. Private source/settings backup: sibling evidence/enquiry-growth/worker-before, outside Git. The backup was exported through an authenticated read-only API request.

Use `wrangler deploy --config site/worker/wrangler.jsonc` for this source. To stop new sends, set DISABLE_SEND=true and deploy; do not change DNS. Keep the v2 Worker during a static-site rollback because it accepts the old payload. A Durable Object migration can restrict rollback to a pre-migration Worker version; if rollback of code is needed, deploy the prior handler from Git while retaining the InquiryGuard class/binding/migration. Do not delete the namespace or counters as a rollback shortcut.

Email delivery remains to the existing verified destination, preserving the known free route. Sending to info@ as a forwarding alias has not been verified as an eligible destination; it was not changed speculatively. Direct info@ forwarding remains an independent existing route. Do not buy arbitrary-recipient email sending to solve this.

## Verification and owner actions

Release evidence: PR #8 (`codex/organiya-enquiry-growth` → `codex/organiya-launch`). Source commit `1ee3962f8bda348381f66b8b7eb81447c75184db` passed 43 backend and 17 browser/dashboard tests, including GitHub CI. Cloudflare preview `dbc13e4c-dd04-42cb-accb-9242f0878f0b` passed an additional deployed mobile, search/context and generic-form smoke check. Website content revision: `7afc021125a2`.

The compatible Worker was deployed first as version `b82c2a27-59f7-477b-b1bd-496e0c20957f`. Deployed binding metadata confirmed the existing encrypted recipient and Turnstile secret, new encrypted abuse key, rate limiter and `InquiryGuard` namespace. Live GET returned 405 with handler version 2; seven invalid POSTs returned validation errors and then 429 with Retry-After 60. These negative checks sent no mail. The short-window binding is approximate, as documented above. A small singular/plural correction to the throttle message follows this first deployment; final version and production merge evidence are retained with the PR and private release evidence.

Automated tests use mocked email/Turnstile and synthetic private-register records. They do not send real mail. Browser checks cover 320/390/768/1440px, galleries, filters, keyboard, no-JS fallback, accessibility, purpose/scope choices, attribution, failed/retried submissions and offline import/export. Backend checks cover legacy compatibility, validation, races, exact windows/caps, duplicate IDs, unknown delivery and storage failure. A deployment dry run validates the Worker bundle and bindings.

Owner verification after release:
1. Submit one clearly labelled enquiry yourself, check the configured inbox and Spam, and confirm Reply-To works. Previous inbox receipt was never confirmed. Provider acceptance is not proof of inbox placement.
2. Import that notification into the local register and mark it Test so it is excluded from reporting. Save/reopen the private JSON file.
3. Assign the daily inbox owner and the master-register location. Internal response target: two working days; actual follow-up remains a human task.
4. Review business facts and ask 5–10 India-based target readers whether offer, upcoming status and next step are clear. This reader study is not replaced by automated tests.
5. Review legitimate throttling after 14 days and before exhibitions; shared office/mobile IPs can trigger limits. Adjust from evidence, never by purchasing an upgrade automatically.

Intentionally not enabled: full visitor/funnel tracking, IP geolocation, automatic CRM sync, marketing enrolment, email OTP verification, regional translations, commerce, prices or licence claims. These are optional/later work, not requirements for the lightweight Now–P2 release.

Sources checked: [Durable Objects Free pricing and hard limits](https://developers.cloudflare.com/durable-objects/platform/pricing/), [Rate Limiting binding and per-location caveats](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [free sends to verified destinations](https://developers.cloudflare.com/email-service/platform/pricing/).

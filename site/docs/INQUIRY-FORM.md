# Organiya inquiry form

The visitor form replaces the email-app CTA on Contact and Distributors. The existing Option O design and selected-product context are retained. Name, email and a message are required; company and phone are optional business fields. No file uploads, automatic replies, marketing enrollment or inquiry database.

## Runtime

The static Pages site calls the same-origin POST /api/inquiry route. A separate Worker handles only that route, checks origin, caps request size, validates product identifiers against the catalog, rejects honeypot values and validates Turnstile server-side (hostname organiyaglobal.com and action inquiry). It sends through the EMAIL service binding to the fixed server-side INQUIRY_TO destination. The dashboard exposes no destination restriction for this binding; the handler never accepts a recipient from the browser. The sender is website@organiyaglobal.com; Reply-To is the validated visitor address. Never let client input choose the destination or sender. No message contents or request bodies are logged.

Required Worker bindings/settings:
- SITE_ORIGIN: https://organiyaglobal.com
- INQUIRY_TO: the verified destination currently used by the info@ routing rule; configure privately, do not expose in static content.
- EMAIL: send_email binding. Destination selection is fixed in the handler through INQUIRY_TO; no client-supplied destination is allowed.
- TURNSTILE_SECRET: encrypted secret for the Organiya inquiry form widget. Never commit it.
- Route: organiyaglobal.com/api/inquiry in the existing zone. Keep the rest of Pages unchanged.

The public Turnstile key is in content/site.json. The widget is Managed and restricted to organiyaglobal.com, with no pre-clearance. No secret belongs in HTML or browser JavaScript. The site CSP allows only Cloudflare's challenge origin in addition to its own resources.

## Release

1. Validate/build and run both npm run test:inquiry and npm test. Browser tests mock Turnstile and submission; backend tests mock delivery.
2. Commit source and open a PR to codex/organiya-launch. Review the form in a deployment preview. The production-only Turnstile widget cannot complete on the preview hostname.
3. Deploy the reviewed Worker with the email binding, fixed destination and secret; confirm bad/missing tokens cannot send. Production form submission must not be exposed until the Worker is ready.
4. Merge the static site after checks pass. Submit one clearly labeled owner-approved test inquiry and confirm Cloudflare mail-service acceptance and receipt in the configured inbox. The confirmation screen proves acceptance, not inbox placement.
5. Keep existing DNS/MX records, direct info@ routing and old-site backup unchanged. No paid plan is necessary for mail to a verified destination within the existing free service limits; review usage before any paid upgrade.

## Rollback

Restore a known working static Pages deployment and, if necessary, its compatible Worker version. Preserve the Worker source and deployment; disable its dedicated route if needed. Do not change DNS or email forwarding as a rollback step.


## Deployment record — 2026-11-12

Worker `organiya-inquiries` was deployed through the Cloudflare editor from the committed handler and catalog map. Production settings contain SITE_ORIGIN and encrypted INQUIRY_TO / TURNSTILE_SECRET, plus EMAIL. The exact route `organiyaglobal.com/api/inquiry` fails closed. Compatibility date: 2026-11-12. GET returned 405 and an invalid Turnstile token returned 400 without attempting email. Existing DNS and forwarding rules were unchanged.

For subsequent code changes, deploy `worker/index.mjs` with Wrangler or bundle the handler and product map for the dashboard editor; preserve the existing bindings and secrets. The Pages Git integration deploys the static website only, not this separate Worker.

The owner-approved live inquiry was accepted on 2026-11-12. Inbox receipt remains unconfirmed: the owner will check later. No additional test emails were sent. The real widget revealed a 320px overflow that the original empty mock missed; use the documented compact widget size and model its physical dimensions in responsive tests.

## Next development tranche

Use [GROWTH-AND-CONTENT-PLAN.md](GROWTH-AND-CONTENT-PLAN.md) for the proposed generic enquiry form, declared product scope, business follow-up, metadata/privacy choices, exact abuse thresholds and India-focused copy. These proposals are not deployed controls. The immediate public-email cleanup removes mailto links, rendered addresses and the address in browser content; email routing and Worker delivery are unchanged. JavaScript is required for submissions, with an explicit no-JavaScript instruction. Existing public repository history and delivery-error fallback are not erased.

# Organiya inquiry form

The visitor form replaces the email-app CTA on Contact and Distributors. The existing Option O design and selected-product context are retained. Name, email and a message are required; company and phone are optional business fields. No file uploads, automatic replies, marketing enrollment or inquiry database.

## Runtime

The static Pages site calls the same-origin POST /api/inquiry route. A separate Worker handles only that route, checks origin, caps request size, validates product identifiers against the catalog, rejects honeypot values and validates Turnstile server-side (hostname organiyaglobal.com and action inquiry). It sends through a destination-restricted EMAIL binding. The sender is website@organiyaglobal.com; Reply-To is the validated visitor address. Never let client input choose the destination or sender. No message contents or request bodies are logged.

Required Worker bindings/settings:
- SITE_ORIGIN: https://organiyaglobal.com
- INQUIRY_TO: the verified destination currently used by the info@ routing rule; configure privately, do not expose in static content.
- EMAIL: send_email binding restricted to that same destination.
- TURNSTILE_SECRET: encrypted secret for the Organiya inquiry form widget. Never commit it.
- Route: organiyaglobal.com/api/inquiry in the existing zone. Keep the rest of Pages unchanged.

The public Turnstile key is in content/site.json. The widget is Managed and restricted to organiyaglobal.com, with no pre-clearance. No secret belongs in HTML or browser JavaScript. The site CSP allows only Cloudflare's challenge origin in addition to its own resources.

## Release

1. Validate/build and run both npm run test:inquiry and npm test. Browser tests mock Turnstile and submission; backend tests mock delivery.
2. Commit source and open a PR to codex/organiya-launch. Review the form in a deployment preview. The production-only Turnstile widget cannot complete on the preview hostname.
3. Deploy the reviewed Worker with the narrow destination binding and secret; confirm bad/missing tokens cannot send. Production form submission must not be exposed until the Worker is ready.
4. Merge the static site after checks pass. Submit one clearly labeled owner-approved test inquiry and confirm Cloudflare mail-service acceptance and receipt in the configured inbox. The confirmation screen proves acceptance, not inbox placement.
5. Keep existing DNS/MX records, direct info@ routing and old-site backup unchanged. No paid plan is necessary for mail to a verified destination within the existing free service limits; review usage before any paid upgrade.

## Rollback

Restore the previous static Pages deployment to return to email-app inquiries. Preserve the Worker source and deployment; disable its dedicated route if needed. Do not change DNS or email forwarding as a rollback step.


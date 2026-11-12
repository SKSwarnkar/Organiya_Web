# Organiya launch record

## Scope

Final Option O, upcoming Spicenza snacks in India, email inquiries to info@organiyaglobal.com. User explicitly authorized production launch and DNS cutover and required preservation of the previous site. The user confirmed the email address is monitored and receiving mail.

## Preserved legacy website

- Repository: SKSwarnkar/Organiya_Web.
- Legacy source: e3eb154cefc9bb748857828eff1b1ecddbde0395.
- Archive tag: archive/pre-option-o-2026-11-11.
- Legacy `main` branch, original root files and existing GitHub Pages deployment are retained.
- Separate local backups: complete Git bundle, source archive, original working-copy archive and Cloudflare DNS export, with SHA-256 manifest. Restore verification is recorded in the private launch evidence.

## Prior DNS (Cloudflare zone snapshot)

- Nameservers: clarissa.ns.cloudflare.com and kayden.ns.cloudflare.com; unchanged.
- Apex A: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; DNS only; dashboard TTL Auto (public answers 300s).
- www CNAME: skswarnkar.github.io; DNS only; TTL Auto.
- Email: three MX records, SPF and cf2024-1._domainkey DKIM must be preserved exactly. Full zone export kept privately.
- Canonical production hostname remains https://organiyaglobal.com/.

## Rollback

For a code/content defect, restore the preceding good Cloudflare production deployment, then revert the matching source change. For a first-release or domain/TLS failure, restore the four apex GitHub A records and www CNAME above, including DNS-only and Auto TTL; remove only the conflicting website CNAME. Leave all MX/TXT, nameservers, domain registration and legacy GitHub domain binding intact. Verify HTTPS, apex/www and contact access after restoring. Keep both old and new site sources permanently; do not delete the old site when the initial observation window ends.

## Deployment evidence

- Cloudflare Pages project: `organiya-website`; default hostname: https://organiya-website.pages.dev/.
- Git source: `SKSwarnkar/Organiya_Web`, production branch `codex/organiya-launch`, root `site`, framework None, command `npm ci && npm run build`, output `dist`, `NODE_VERSION=22`.
- Initial deployment: `df7aa2ec-969c-421e-8de1-542e11c6560c`, source `c8de9118779e149f586a1a52450d04b6a332a8d8`. The current deployment's exact source and content revision are published at `/release.json`.
- Both `organiyaglobal.com` and `www.organiyaglobal.com` became Active with SSL on 2026-11-12 UTC (2026-11-11 Pacific). A short initialization window returned 522 before activation completed.
- Apex and www now have proxied CNAME records to `organiya-website.pages.dev`, TTL Auto. All five MX/TXT records match the exported pre-cutover values exactly. Nameservers and registrar are unchanged.
- Canonical redirect is a Cloudflare Single Redirect named `Organiya www to canonical domain`: `https://www.organiyaglobal.com/*` → `https://organiyaglobal.com/${1}`, 301, preserve query string. HTTP is upgraded to HTTPS. Pages `_redirects` handles legacy paths, not hostname redirection.
- The public inquiry address is intentionally published. Generated mailto anchors use Cloudflare's `email_off` HTML markers so email inquiries remain usable with JavaScript disabled; other Cloudflare security settings are unchanged.
- The complete local suite and GitHub CI passed before deployment. The Pages preview passed all eight functional/responsive checks. Live-domain QA identified and corrected hostname redirection and Cloudflare rewriting of no-JavaScript email links. Final rerun results, screenshots, DNS comparisons and backup restore proof are stored in the private launch evidence folder.
- Backup restoration verified the original commit, a clean worktree and `git fsck --full`; all four archive/snapshot SHA-256 hashes verified.
- No paid infrastructure, CMS, orders, payments or form-submission service was enabled. Email delivery is based on the owner's confirmed monitored mailbox; the launch checks do not send emails.

## Future releases

Make content changes on a separate `codex/` branch. Open a pull request targeting `codex/organiya-launch`, let the GitHub checks pass, and review the Cloudflare preview before merging. Cloudflare automatically publishes that production branch. Do not merge this site over the legacy `main` branch. Preserve the preceding good deployment for rollback and verify `/release.json`, contact links and affected pages after each release.

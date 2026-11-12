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

Preparation in progress. Actual project hostname, release commit, deployment ID, DNS result and live QA evidence will be recorded after verification.

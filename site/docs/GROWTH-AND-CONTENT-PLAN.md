# Organiya: enquiries, business development and India-focused copy

Date: 12 November 2026. Status: Now–P2 implementation delivered in the enquiry-growth release, with owner verification outstanding. Owner: Organiya founder; implementation: Codex. This extends INQUIRY-FORM.md and is the single plan for this tranche. No change to the snack-only launch, Option O design, upcoming-product status or Organiya/Spicenza relationship.

## Release status and cost decision

The Now–P2 engineering work is implemented. See [ENQUIRY-GROWTH-RELEASE.md](ENQUIRY-GROWTH-RELEASE.md) for exact deployed settings, tests, rollback and owner checks. The sections below retain the original design rationale; this status section supersedes their future-tense wording.

| Item | Release outcome |
| --- | --- |
| Public-email cleanup and typography | Retained and regression checked |
| WAF, Worker throttles, global caps and deduplication | Implemented with the Free WAF slot, Rate Limiting binding and one SQLite-backed Durable Object |
| Generic enquiry form | Seven purposes, all/multiple/unlisted/no-product scopes, conditional optional fields, legacy compatibility |
| India business copy | Updated; founder factual review and target-reader feedback remain human checks |
| Structured emails and private lead register | Implemented; local offline app with email-record import, private export, ownership and follow-up |
| Minimal attribution and weekly dashboard | Submission-only allowlisted attribution and offline business metrics; no separate tracking requests |

The owner's free-tier constraint determines the P2 implementation: no SaaS CRM, automatic synchronisation, paid email sending, extra event-analytics endpoint, GPS or IP-location enrichment. Campaign codes propagate through site links without browser storage. The local dashboard counts imported enquiries and outcomes, not visitor sessions or abandonment. The existing verified email destination is preserved; changing the sender route to info@ remains unverified and is not required for these features.

The owner must confirm inbox receipt, choose the daily operator/master-register location, and review factual copy with target readers. No additional real test email was sent during this release. Existing successful mail-service acceptance still is not proof of inbox placement.

## Decisions and scope

Use one shared enquiry form for every visitor. Remove the Product inquiry / Business inquiry duplication. A product is not a prerequisite for contacting a company. Separate **why the person is contacting us**, **what interests them**, and **where they came from**; never infer one from the other.

Optimise for useful conversations, not maximum personal-data collection or raw form counts. A small number of qualified stockists with a clear next step is more valuable than a large list of poorly understood addresses. Ask four essential questions first and progressively reveal relevant optional questions. Keep the site welcoming to consumers and official contacts while giving business opportunities a clearer route.

Immediate release: remove public mailto links, repeated visible email addresses, the copy-email button and the address from browser content. Replace relevant navigation with contact-form links and update privacy/no-JavaScript instructions. Existing inbox routing, Worker delivery and old-site backups are unchanged. Backend error responses can still provide the existing support email on a delivery failure; this release does not make an already-public address secret or remove it from repository history/search caches.

The follow-up typography release improves supporting text, controls and captions throughout the existing pages, including the retailer introduction. It retains the headline wording and approved visual identity; see the measured audit in section 5.1.

The enquiry-growth release activates the redesigned form, rate limits, business copy and submission-only attribution. Geolocation enrichment, raw-IP lead storage, CRM integration and separate funnel-event tracking remain off. No new test email is authorised by this plan.

## 1. One form, with purposeful choices

Heading: **Contact Organiya**. Introduction: “Contact us about products, buying enquiries, retail and distribution, partnerships or company documentation.” Primary button: **Send enquiry**. Confirmation should show a reference number and say the enquiry was received only when the selected delivery/storage contract has succeeded. Do not promise a response time until there is an owner and coverage.

Always required: name, email, enquiry purpose and message, plus the existing acknowledgement for using the details to respond. Accept personal email providers: many legitimate Indian proprietors use Gmail. Do not treat a corporate domain as proof of legitimacy. Ask for organisation, phone and location only when helpful; no mandatory account, OTP, GSTIN, licence number or attachment on first contact.

| Purpose | Helpful follow-up fields (optional unless explicitly stated) | Handling |
| --- | --- | --- |
| Retail or distribution | Organisation; role (retailer, distributor, stockist, online seller, other); city/state or territory; current sales channels | Business development, territory qualification |
| Bulk or institutional purchase | Organisation; intended use; approximate quantity and unit; timing (“exploring / after launch / later”) | Purchase interest, not an order or availability commitment |
| Product or buying enquiry | Product interests, question, city/state if availability matters | Consumer or trade enquiry; no checkout |
| Partnership or supply proposal | Organisation; proposal type (supplier, manufacturing, logistics, marketing, other); website | Review manually; do not crawl supplied links automatically |
| Regulatory or company documentation | Organisation/department; document requested; reference number if available | Founder review; includes FSSAI-related correspondence, not an official FSSAI application portal |
| Feedback or support | Topic and message; product only if relevant | Service/follow-up; complaints kept separate from sales scoring |
| General enquiry / something else | Message; optional organisation | Catch-all, including requests not covered by current products |

Show no more than three extra fields at once; further details can follow in a reply. Optional phone appears with a preferred-contact choice (email / phone). If phone is selected, require a usable number with country code; this is not WhatsApp marketing consent. A later optional “Anything else that would help us?” field must not duplicate the required message.

### Product interest is optional and independent

Offer one scope choice:
- The whole range.
- Specific products — a multi-select of the six current concepts.
- A product not shown — optional short description, including cookies/spices/pulses without advertising those as available.
- Not product-related.
- Not sure yet / prefer to discuss.

Default general Contact, footer and company-documentation links to no product selection. A product-page CTA may preselect that product but must allow clearing it or choosing other products. The source product is recorded separately from the visitor’s declared interest. A person viewing Chia Crunch Sticks who asks about distribution of the whole range is a whole-range lead, not automatically a chia buyer. Retailer-page links may preselect retail/distribution intent, still editable.

### Content and API structure

Add content/inquiries.json for purpose labels, hints, conditional field rules, interest choices and message copy. Keep reusable form rendering/client validation separate from page composition. Use stable internal enums and an explicit schemaVersion. The Worker owns the allowlist and validates all combinations; browser checks are only convenience.

Suggested submission fields: purpose, name, email, message, interestScope, productIds[], unlistedInterest, organisation, businessRole, city, state, country, territory, quantityBand, quantityUnit, timing, preferredContact, phone, responsePermission, noticeVersion and requestId. Omitted optional fields stay null; do not fill fabricated defaults. Reject product IDs not in the approved catalog and product arrays on “not product-related”. Record email as visitor-provided/unverified until an actual reply or verification event.

Deploy a backward-compatible Worker accepting old and new payloads first; then deploy the new static form. Retain compatibility during rollback. Update both the ordinary contact page and distributor-page instance from the same schema. Do not change the existing Crunch Mix URL just to rename a display field.

## 2. Metadata that answers real business questions

Hidden fields are not trusted fields. All browser-supplied attribution can be missing, changed or spoofed. Validate lengths and allowlists and label the source. Never let metadata determine recipient, permission or regulatory status.

| Signal | Proposed treatment | Business use |
| --- | --- | --- |
| Reference, server timestamp, form/content version | Server generated; timestamp stored UTC and shown IST for operations | Traceability, release comparisons, response time |
| Entry page and CTA ID | Allowlisted page path and stable CTA ID; no full URL/query dump | Which pages and placements generate useful enquiries? |
| Source product vs selected interests | Store separately, including all/unlisted/none | Discover cross-product demand and missing ranges |
| Campaign | Allowlisted utm_source, utm_medium, utm_campaign; short known campaign codes, unknown/unattributed allowed | Compare QR cards, exhibitions, partner referrals, search and campaigns |
| Referrer | Referring domain only, when available; strip path/query | Broad referral source, not browsing history |
| QR/offline source | Unique non-personal codes per event, printed card batch or sales partner | Which offline introductions turn into business conversations? |
| Declared service territory | Optional visitor-entered city/state/country and territory | Distributor coverage and expansion priorities; preferred over IP inference |
| Approximate network location | Optional future country/region from Cloudflare, after privacy review and disclosure; never silently write IP-derived city as the person’s actual location | Aggregate demand by region; VPN/mobile-network estimates may be wrong |
| Device/language | Coarse device class and preferred language if analytics is enabled; no full user-agent history | Find mobile friction and demand for Hindi or other languages |
| Security outcome | Validation category, rate-limit result, Turnstile result, delivery status; no token/body in logs | Abuse and reliability monitoring, separate from sales data |

Do not request browser GPS permission: exact location is unnecessary for an enquiry. Preserve the current geolocation=() Permissions-Policy. Do not collect GPS coordinates, fingerprints, screen recordings, keystrokes, full browsing history, demographic guesses, Aadhaar/PAN, financial documents or attachments in the first form. Do not use IP address to infer identity, wealth, religion, ethnicity or lead value.

IP handling: the server necessarily receives an IP, and it is already used for Turnstile verification. Use it transiently for security; do not insert raw IPs into lead emails, sales sheets or analytics. For longer abuse windows, use a keyed HMAC with short retention, not a plain IP hash. Such identifiers remain pseudonymous, not anonymous. Keep operational provider logs distinct from application retention; the application cannot promise deletion of all provider logs in its own TTL.

Recommended retention defaults for implementation review: abuse keys/counters up to 48 hours, deduplication keys 24 hours, sanitised security outcomes 7 days, enquiry records 12 months from last meaningful interaction unless an ongoing relationship or legal requirement warrants more, aggregated non-identifying monthly metrics 24 months. Apply deletion to mailbox/CRM copies and exports as well as any database. These are proposed operating policies, not statements about current automatic deletion.

The short form notice must explain the response purpose, provider processing and link to privacy details. Marketing updates require a separate optional unchecked choice; never make marketing permission a condition of enquiry. Extra analytics/enrichment must remain off until purpose, access, applicable lawful basis/consent and retention are settled. Browser location permission is not a substitute for data-protection compliance; the absence of a browser prompt does not make location/IP collection unrestricted. The Indian DPDP framework has staged commencement; check requirements in force at implementation, rather than stating that all requirements are already effective or that all IP collection is automatically permitted.

## 3. Make enquiries usable from the first week

Start with a structured email subject: `[Organiya][Distribution][Maharashtra] <reference>`. Put visitor-stated details first, then product interests, message and a short attribution section. Label reply-to as visitor-provided/unverified. Do not put full messages or email addresses in monitoring logs. All purposes initially go to the same controlled inbox; changing purpose must not allow client-controlled routing.

Maintain a private lead register with these fields: reference, purpose, organisation/contact, stated territory, interests, source, assigned owner, status, next action and due date, last contact, outcome and a short reason. Start with manual entries in an owner-controlled private sheet if preferred; connect a CRM only when repeated volume makes automation worthwhile. Do not put lead files in the public GitHub repo or expose an unauthenticated admin page. Any CRM connector, recipients and access must be deliberately configured.

Sales statuses: New → Reviewed → Contacted → Qualified → Follow-up → Converted / Closed / Not now. “Converted” means a recorded actual business outcome, not form submission. Keep regulatory/documentation and support queues separate; they are not failed sales leads. Define “qualified” as a plausible need, serviceable territory/channel and a useful agreed next step. Gmail addresses and low quantities are not automatic disqualifiers. No AI-based automatic rejection, external enrichment or credit/identity scoring.

Proposed owner cadence: check the inbox each business day; aim for a first human response within two working days, internally first. Add a public response promise only after this can be sustained. No automatic visitor acknowledgement until sender verification, abuse protection and consent are appropriately implemented. The current page confirmation is sufficient initially.

### Measurement and practical decisions

Optional funnel events (no field contents): form_view → form_start → submit_attempt → validation_error / rate_limited / provider_accepted. “Email delivered” requires provider delivery evidence; “received in inbox” requires actual confirmation. Acknowledged by the email service is not proof of inbox placement. Count genuine non-test submissions separately from duplicate/retry traffic.

If event analytics is approved, use short-lived random session/event IDs, not fingerprinting. Avoid cross-visit tracking by default. Campaign capture in memory is lost across full-page navigation; use explicit allowlisted campaign propagation for same-visit links, or narrowly scoped session storage only after the relevant privacy decision. No form drafts or sensitive values in URLs/storage. Attribution is incomplete when referrers or consent are absent; retain “unknown” rather than fabricate first-touch attribution.

Weekly dashboard:
- Valid enquiries and qualified business leads by purpose, source, product scope and visitor-declared state.
- First-response time, unassigned leads and overdue follow-ups.
- Qualified-lead rate (qualified/reviewed sales enquiries), not just submission count.
- Product gaps mentioned, distributor territory gaps, bulk-use cases, and top unanswered questions.
- Form starts to accepted submissions, grouped error rates and mobile friction if the optional event collection is enabled. Without form-view/start instrumentation, do not claim conversion/abandonment rates.
- Provider failures and security blocks, separate from the marketing funnel.

Example actions: repeated unlisted-cookie requests → interview interested buyers, not immediately announce a SKU; credible leads from a state → prioritise distributor calls; many catalog visits but few enquiries → investigate clarity/availability expectations; exhibition QR leads → compare qualified conversations per event cost. At low traffic, report counts, read conversations and interview 5–10 prospects. Do not draw regional demand conclusions from IPs or call small A/B samples statistically significant.

## 4. Exact initial abuse limits

These thresholds are implemented in the enquiry-growth release; the operational warning appears in Worker logs and the next accepted notification email. The Free WAF slot was unused and is now assigned only to /api/inquiry. No paid upgrade is authorised. Review legitimate rejections after the first 14 days and before exhibitions/campaigns.

| Control | Initial setting | Implementation / caveat |
| --- | --- | --- |
| Edge burst protection | 10 requests per IP per 10 seconds to path /api/inquiry; block for 10 seconds | Cloudflare Free WAF supports one rule and 10-second periods. Path-only expression avoids assuming paid method/host match capabilities. Applies to that endpoint, not site browsing. Inspect existing rules first; never replace another rule silently. |
| Worker pre-verification throttle | 5 POST attempts per IP per 60 seconds | Rate Limiting binding before expensive verification/sending. Return 429 with Retry-After: 60 and retain the form text. Approximate/per-location; not a worldwide quota. |
| Sustained valid traffic | 10 verified, valid submissions per IP per rolling hour | Atomic shared counter after Turnstile and field checks. Shared office/mobile IPs can create false positives; review, provide a clear retry path and adjust thresholds with evidence. No permanent block based solely on IP. |
| Claimed email repetition | Flag more than 3 submissions/hour from one normalised email | Advisory signal, not the sole hard block: an attacker can type someone else’s address. Never equate this field with an authenticated account. |
| Duplicate/retry protection | Same request ID/body is idempotent for 24 hours; identical normalised email+purpose+message suppressed for 10 minutes | Keyed digest; preserve an existing outcome. Concurrent requests must not send twice. Unknown delivery outcome is not blindly retried. Keep digest/status only, not a duplicate body archive. |
| Overall email safeguard | At most 25 notification send attempts per rolling hour and 100 per rolling 24 hours across all locations | A single SQLite-backed Durable Object serialises reservations before provider calls. Failed/uncertain attempts still consume quota conservatively. Counters are not per-process variables or eventually consistent KV. |
| Operational warning | Flag 20/hour or 80/24h in the operations view; manual release switch at the hard cap | No success screen if mail is not sent. Display a temporary-unavailability message, preserve entered fields, and allow later retry. Do not silently drop an enquiry or collect an unbounded queue. |

Existing controls stay: mandatory server-side Turnstile verification (correct hostname/action, single-use token), fixed server-side recipient, strict field validation, 24,000-byte body cap, 4,000-character message maximum, no attachments, no visitor-address auto-replies. Origin checks help with browser misuse but are not authentication: a non-browser attacker can forge an Origin header. Do not block all non-India traffic; legitimate overseas partners and regulatory advisers may contact the company.

Implementation order: reject wrong path/method/origin/type/size → short-window throttle → validate fields/trap → verify Turnstile → reserve global/per-IP quota and idempotency atomically → attempt email → record accepted/failed/unknown status → respond truthfully. If quota storage is unavailable, fail closed for sending with a retryable message. Keep credentials server-side. Do not log Turnstile tokens or message contents. Global caps protect inbox volume but cannot guarantee availability during a distributed attack; a determined attacker could exhaust the cap, so an owner must be able to inspect and adjust it.

SQLite Durable Objects are currently available on Workers Free. Free allowances are finite and exceeding them can make operations fail; do not promise unlimited free protection. A strict worldwide rolling cap requires this small code/storage addition; it is not a checkbox in the Free WAF. Binding and WAF limits alone are approximate and cannot substantiate a global 100/day guarantee. Test counter races, retries, storage errors and time-window expiry before deployment. Keep the public form working during the staged rollout, and record each setting plus rollback.

Email routing follow-up: sending to info@ would centralise the forwarding rule, but the current free handler targets the verified inbox directly. Verify that info@ is an allowed send destination and test that forwarding path before changing INQUIRY_TO. If unavailable, retain the current working path and document the two settings rather than quietly buying another service. Do not change MX records for this form work.

## 5. India-focused business copy

The current phrases are not inherently incomprehensible to Indians. The problem is that repeated metaphors and lifestyle language obscure the business purpose and pre-launch facts. Use plain Indian English, short sentences, specific nouns and clear actions. Keep occasional warmth in serving ideas; avoid bureaucratic language (“kindly do the needful”), exaggerated health claims or caricatured Hinglish. Use “enquiry”, “catalogue”, “favourite” and “organisation” consistently in visible copy. API names need not change.

| Current | Proposed | Reason |
| --- | --- | --- |
| Life happens. Snack breaks should too. | Introducing Spicenza snacks in India. | Explain the business immediately; retain “upcoming” in the supporting sentence |
| What’s your snack moment? | Snacks for chai time, work and travel | Concrete occasions, easy to scan |
| Your cup’s new company. | A crunchy pairing for chai. | Clear serving suggestion, not a nutrition claim |
| Imagine the pause | Serving idea: chia sticks with chai and chutney. | Explain what the reader is seeing; keep illustrative label |
| Get in touch | Contact us | Both are understood; the latter is more direct |
| Hello, snack person. | Contact Organiya | Welcomes consumers, partners and officials equally |
| A little space on your shelf? | Retail and distribution enquiries | Clear business intent; no implication that stock is available |
| A place on your shelves | Work with Organiya | Broader than retail alone |
| In the making | Upcoming range | Clearer product status |
| Explore what’s coming | View upcoming snacks | Specific action |
| Our story | About Organiya | Company context first; retain story content within page |
| Thoughtful discoveries. Everyday moments. | Spicenza snacks. Introduced in India by Organiya. | Role clarity; supporting text must state the introduction is being prepared |

Keep **Good food. Everyday possibilities.** as the brand line: simple, adaptable and already preferred. Do not replace every warm phrase with corporate language. “Make a little moment of it” can become **Serving suggestions** as the main heading, retaining the softer line as secondary copy if desired.

### Page-by-page brief

Home: lead with the brand, India relationship and upcoming status. Suggested supporting text: “Organiya Global LLP is preparing to introduce the Spicenza snack range in India. Explore the upcoming products or contact us about retail, distribution and other business opportunities.” Primary CTA View upcoming snacks; secondary Retail & distribution enquiries. Put the partner invitation above the extended occasion content; retain Option O’s cards and colours.

Catalogue: heading Upcoming Spicenza snacks. Preserve six concept names and clear development/illustration notices. No “buy”, prices, MOQ, margins, territories or availability promises until confirmed. Include a link “Looking for another product? Tell us what you need” to the generic form with interestScope=unlisted.

Product: plain description of the current concept; actual product identity still needs founder verification. Preserve the preferred image cards/gallery and serving suggestions. Add actions Enquire about this product and Explore retail & distribution. Multi-product/no-product choices remain available. Avoid “protein-rich”, “healthy”, “natural”, “organic”, gluten-free, percentages and certifications without approved evidence; a brand name or seeds in an illustration do not establish such claims.

About: put legal company name, India role and Spicenza relationship first, then a short factual story. Publish only verified founder/company facts; request missing facts during editing rather than invent a sourcing history, manufacturing network, export track record or certification. Keep American family imagery as secondary serving inspiration, with the existing India-launch clarification; do not imply US sales are offered by Organiya.

Retail/distribution: explain who should enquire, what information helps, and what happens next. Be explicit that pricing, pack sizes, supply dates, territories and terms are not yet announced. Do not solicit payments or promise exclusivity. Include suppliers/other partners through the general form rather than presenting every visitor as a retailer.

Contact/privacy/errors: neutral company language, clear labels, field-level examples, useful error/retry instructions and a reference after acceptance. Regulatory documentation enquiries have a clear route but no implication of FSSAI approval. Do not publish licence statements until verified and appropriate to the launch phase.

Review pass must include navigation, footer, buttons, product notes, image captions/alt text, FAQs, validation/error/success messages, page titles, meta descriptions and social-sharing text. Store editable copy in content JSON; remove duplicate strings from layouts as these sections are touched. Test heading wraps at 320/390/768/1440px rather than preserving hard-coded line breaks from old slogans.

### 5.1 Typography and readability audit

The retailer introduction was 15px on desktop and 14px on mobile, beside a 72px / 49px heading. It was readable, but visually underweighted for the sentence explaining the business opportunity. The problem was the hierarchy, not simply that all large headings should shrink. Keep the expressive Option O headlines and bring supporting information up to an appropriate reading size.

The audit covers Home, Catalogue, a full product page, Our story, Distributors, Contact and Privacy. Product templates share the same rules. Computed styles, text-node sizes and screenshots were reviewed, rather than judging only a scaled screenshot.

| Role | Before (desktop / mobile where different) | Implemented target |
| --- | --- | --- |
| Retailer page headline | 72px / 49px | Unchanged |
| Page introduction | 15px / 14px | 20px / 18px; line height 1.6 |
| Main reading paragraphs | Commonly 13–15px | 16px; line height 1.75 |
| Product-card description | 12px / 11px | 15px; line height 1.6 |
| Primary controls and form fields | Commonly 11–13px controls; mobile inputs already 16px | 16px primary controls/fields; 14px compact filters |
| Important notices, consent and helper text | Commonly 10–13px | 14px |
| Secondary labels and illustrative-image captions | Some 8–10px | 12px |
| Footer navigation and legal/supporting text | Commonly 9–12px | 14px links; 13px supporting/legal text |

These are hierarchy targets, not a claim that WCAG sets a universal minimum font size. Keep headings, reading text, actions and captions distinct. Use shared rem-based tokens in styles/production.css; do not reintroduce smaller page-specific overrides. Limit lead/body line length to approximately 62–65 characters where useful. Preserve existing foreground/background colours and test contrast separately.

The larger image captions retain the 4:5 product framing. Move the decorative card arrow away from the caption, and place the tiny contact-thumbnail caption below its image rather than overlaying it. Allow controls, metadata and supporting rows to wrap instead of shrinking text to fit. No product artwork changes are needed for this pass.

Acceptance: responsive checks at 320, 390, 768 and 1440px; all page routes, images and navigation; keyboard controls, galleries, mocked enquiry validation/submission and automated accessibility checks. Add a root-font 200% stress check for the new rem-based text and inspect narrow-screen cards and the retailer introduction visually. That stress check complements, but does not substitute for, browser zoom or a full manual accessibility audit. Recheck actual browser zoom, wrapping and text spacing when the wider copy rewrite changes headline lengths or adds form fields. Do not send a real enquiry during typography tests.

For the later copy pass, review typography with the words: the introductory sentence should explain the business purpose before decorative content competes with it. Test with India-based retailers/distributors on their own phones, including readers who enlarge text. Record confusing words and hard-to-read sections separately.

## 6. Priorities, effort and acceptance

Estimates are focused engineering/editorial days, not fixed calendar promises; content decisions, authentication and founder review can affect elapsed time.

| Order | Deliverable | Complexity / estimate | Acceptance |
| --- | --- | --- | --- |
| Now | Public email-link cleanup and this plan | Low; this release | No mailto or public email address in built HTML/client assets; forwarding unchanged; form works |
| Now | Shared typography/readability improvements | Low; follow-up release | Stronger retailer introduction; readable body, controls and captions; responsive, enlarged-text and existing functional checks |
| P1 | Basic WAF/Worker throttles plus strict global cap/deduplication | Medium; 1–2 days | Boundary/concurrency/expiry/failure tests; useful 429; no real mail during automated tests; deployed settings recorded |
| P1 | One form with purpose, optional product scope and conditional fields | Medium; 1–2 days | General/all/unlisted/no-product cases; regulatory path; editable prefill; old API payload compatibility; keyboard/mobile tests |
| P1 | Business-focused copy pass using the examples above | Low–medium; 1–2 days | Founder checks factual accuracy; 5–10 India-based target readers can identify offer/status/next step; no unsupported claims |
| P2 | Structured email and private lead register; owner/reply routine | Low–medium; about 1 day | One owner per actionable lead; agreed next step; no public personal-data files; documented retention |
| P2 | Minimal attribution and weekly dashboard | Medium; 1–2 days after privacy decisions | No PII in events/URLs; unknown sources preserved; test/bot/duplicate separation; clear metric definitions |
| Later | CRM automation, regional language support, campaigns and product launch details | Separate scope after real enquiry evidence | Choose tools and languages from measured need; no speculative paid subscriptions |

Publish in small checked PRs. The website remains plain static HTML/CSS/JS with a Worker; no Astro, Decap or MarketLift dependency is needed. Backend secrets and bindings stay outside Git. Do not publish private lead records or the internal operational plan as a customer-facing page. Preserve existing backups and production rollback. Review this plan before enabling additional data collection; do not claim proposed controls are already installed.

## Sources checked on 12 November 2026

- [W3C: Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) and [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): text enlargement and narrow-layout requirements; no blanket minimum font-size claim.
- [Cloudflare WAF rate limiting availability and caveats](https://developers.cloudflare.com/waf/rate-limiting-rules/): Free fields, periods and rule count; approximate enforcement.
- [Workers Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/): 10/60-second windows and per-location scope.
- [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/): SQLite on Free, finite quotas and failure behaviour.
- [Cloudflare request metadata](https://developers.cloudflare.com/workers/runtime-apis/request/): network-location fields are available; availability is not permission or a guarantee of accuracy.
- [Cloudflare email destinations](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/): verified-destination sending.
- [MeitY DPDP Rules publication](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025) and [notified Rules](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf): phased commencement and privacy-notice framework. Proposed policy requires an applicability review before new collection is enabled.

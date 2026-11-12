# Private enquiry register

Open `lead-register.html` locally in a browser. This standalone tool is excluded from the website build. It does not use a server, account, browser storage or network connection. The checked-in HTML is an empty application, never a customer-data file.

## Daily use

1. Open the last saved private JSON register using **Open / merge register**.
2. Copy a notification email including its `ORGANIYA_RECORD_START` / `ORGANIYA_RECORD_END` block into **Import an enquiry email**. Existing references are not duplicated or overwritten.
3. Review legitimacy and intent manually. Addresses are visitor-provided, not verified identities. Mark known tests, spam and duplicates so they do not inflate reporting.
4. Assign an owner (default: Organiya founder), next action and due date. Aim internally for a first human response within two working days; do not make a public promise without coverage.
5. Record first response and meaningful follow-up timestamps in ISO format, for example `2026-11-12T15:30:00+05:30`. Due dates use `YYYY-MM-DD` in India time.
6. Save the private JSON register after editing. Check that the download succeeded and move it to the private operations folder. Closing/reloading loses unsaved work. The app does not silently persist personal information or back it up.

## Weekly review

The dashboard filters by received date and excludes records marked test/spam/duplicate. Regulatory, support and general enquiries are excluded from the sales qualification denominator. Qualification requires a plausible need, a serviceable territory/channel and an agreed next step; a personal email provider or small quantity is not a reason to reject a lead.

Review overdue actions, qualified leads, real conversions, first-response time, territories, declared interests, unlisted-product requests and campaign source. Counts reflect imported notifications, not every website visit or proof of inbox delivery. There are no form-view/start events, so abandonment and website conversion rates are not reported. Use **Print weekly summary** for a report that omits the contact table.

## Retention and security

Keep register files and mailbox data private. Do not commit them to this repository, upload them to the public website, or paste real contacts into tests. Review inactive records after 12 months, subject to ongoing relationships and applicable obligations; delete corresponding exports/mailbox copies as appropriate. Keep aggregate monthly reports up to 24 months. The tool flags records requiring review; it does not automatically delete records.

No live CRM sync, email sending, geolocation lookup or cloud dashboard is included. A local copy and empty JSON starter are delivered in the sibling `private-operations` folder outside the repository. Copy the app to a trusted local folder on another team member's computer if needed; agree who owns the master register to avoid conflicting copies.

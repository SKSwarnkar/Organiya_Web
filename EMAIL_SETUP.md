# Form Setup Guide

Both the **Contact** page and the **Distributorship** page now embed Google Forms. That means all submissions are handled entirely by Google—no custom backend or EmailJS configuration is required. Create two separate forms (one for general inquiries, one for distributorship applications) and paste their embed links into the site.

---

## Google Form Setup (Contact & Distributorship)

Follow these steps for each form you want to embed:

1. **Build the Form**  
   - Go to [forms.google.com](https://forms.google.com).  
   - Create the form with the fields you need. Use the field lists in the site sections as a reference.  
   - Keep the form public (turn off “Restrict to users in your organisation”).

2. **Copy the Embed Code**  
   - Click **Send** → the `< >` (Embed HTML) tab.  
   - Copy the `<iframe ...>` snippet Google provides.

3. **Update the HTML**  
   - Open the relevant page (`contact.html` or `distributorship.html`).  
   - Replace the existing iframe `src` (or the placeholder `YOUR_DISTRIBUTOR_GOOGLE_FORM_ID`) with the `src` URL from your embed snippet.  
   - Adjust the `height` value if your form is longer or shorter.

4. **Test Locally**  
   - Open the page in a browser (or run `python -m http.server` and use `http://localhost:8000`).  
   - Submit a test entry. Confirm the response shows in the Google Form’s **Responses** tab and in the linked Google Sheet (if you created one).

5. **Publish**  
   - Push the updated HTML to GitHub Pages (or your hosting provider).  
   - Verify the live site embeds the form correctly.

> Tip: Use Google Form themes to align colours with the Organiya palette. You can also enable response email notifications in Google Forms.

---

## Optional Generators (Apps Script)

To save time, the repository now includes **two** form generators:

- `tools/create_organiya_contact_form.gs` – Builds the Contact & Export Inquiry form.
- `tools/create_organiya_distributorship_form.gs` – Builds the Distributorship Application form.

How to use either script:
1. Open [https://script.google.com](https://script.google.com) and create a new project.  
2. Paste the script content (replace any starter code) and save.  
3. Click **Run**, authorize when prompted, and check the execution log for Edit and Public URLs.  
4. Tweak the form in Google Forms if needed, then use **Send → Embed** to grab the iframe URL for the corresponding HTML page.

---

## Managing Responses

- Use the **Responses** tab in Google Forms to view submissions.  
- Click the green Sheets icon to link to a Google Sheet for long-term storage or collaboration.  
- Enable “Get email notifications for new responses” if you want alerts when someone submits.

---

## Alternative Form Providers

If you prefer a different provider but still want to avoid custom backends, consider:

- **FormSubmit** – Drop-in form action (`https://formsubmit.co/you@example.com`).  
- **Formspree** – 50 submissions/month free, supports spam protection.  
- **StaticForms** – Similar approach with API key support.  
- **Netlify Forms** – Built-in if you host on Netlify.  
- **Custom serverless/Backend** – Maximum control if you need advanced workflows.

---

## Troubleshooting

- Seeing “Sorry, the file you have requested does not exist”? Double-check you replaced the placeholder ID with your real Google Form ID and that the form isn’t restricted.  
- Need to edit questions? Update them directly in Google Forms; the embedded iframe reflects changes instantly.  
- Want separate notification recipients? Add collaborators in Google Forms or configure notification add-ons.

---

## Helpful Links

- Google Forms help: <https://support.google.com/docs/topic/6063584>  
- Google Workspace Marketplace add-ons (for notifications, approvals, etc.): <https://workspace.google.com/marketplace/category/works-with-docs-forms>


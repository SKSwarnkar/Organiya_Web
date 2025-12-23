/**
 * Creates the Organiya Global distributorship application Google Form.
 *
 * Usage:
 * 1. Open https://script.google.com/ and create a new Apps Script project.
 * 2. Paste this file into the editor (replace any starter code) and save.
 * 3. Click the Run ▶ button, authorize when prompted, and check the execution log
 *    for the edit/public URLs of the newly generated form.
 */
function createOrganiyaDistributorshipForm() {
  var formTitle = 'Organiya Global • Distributorship Application';

  var form = FormApp.create(formTitle)
    .setIsQuiz(false)
    .setCollectEmail(false)
    .setProgressBar(true)
    .setConfirmationMessage('Thank you for applying! Our distributorship team will contact you within 5-7 business days.')
    .setAllowResponseEdits(false)
    .setLimitOneResponsePerUser(false)
    .setShuffleQuestions(false);

  form.setDescription(
    'Tell us about your business, product interests, and market reach. '
    + 'Organiya Global LLP evaluates each distributorship application to ensure a strong strategic fit.'
  );

  // --- Section 1: Company Basics ---
  form.addSectionHeaderItem().setTitle('Company Information');

  form.addTextItem()
    .setTitle('Company / Business Name')
    .setRequired(true)
    .setHelpText('Your legal business name as it should appear on documentation.');

  form.addTextItem()
    .setTitle('Business Website or Social Profile')
    .setRequired(false)
    .setHelpText('Optional — share your website or a primary social profile so we can review your presence.');

  form.addMultipleChoiceItem()
    .setTitle('Business Type')
    .setRequired(true)
    .setChoiceValues([
      'Wholesale Distributor',
      'Retail Chain / Stores',
      'E-commerce / Online Marketplace',
      'Private Label Manufacturer',
      'Import / Export Company',
      'Food & Beverage Producer',
      'Other'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Years in Business')
    .setRequired(true)
    .setChoiceValues([
      '< 1 year',
      '1 – 3 years',
      '3 – 5 years',
      '5+ years'
    ]);

  form.addParagraphTextItem()
    .setTitle('Headquarters Address')
    .setRequired(true)
    .setHelpText('Street, city, state/province, country, and postal code.');

  form.addTextItem()
    .setTitle('Countries / Regions You Currently Serve')
    .setRequired(true)
    .setHelpText('List key markets or regions where you distribute today.');

  // --- Section 2: Key Contacts ---
  form.addSectionHeaderItem().setTitle('Primary Contact');

  form.addTextItem()
    .setTitle('Contact Person Name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Job Title / Role')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email Address')
    .setRequired(true)
    .setHelpText('We will use this email to follow up on your application.')
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsEmail()
        .build()
    );

  form.addTextItem()
    .setTitle('Phone / WhatsApp Number')
    .setRequired(true)
    .setHelpText('Include country code for international dialing.');

  // --- Section 3: Product & Channel Interests ---
  form.addSectionHeaderItem().setTitle('Product & Channel Interests');

  form.addCheckboxItem()
    .setTitle('Organiya Products of Interest')
    .setRequired(true)
    .setChoiceValues([
      'Moringa Leaf Powder',
      'Turmeric Powder',
      'Ashwagandha Root Powder',
      'Spirulina Powder',
      'Beetroot Powder',
      'Amla Powder',
      'Custom Herbal Blends',
      'Private Label / Retail Packs',
      'Other (please elaborate below)'
    ]);

  form.addParagraphTextItem()
    .setTitle('Other Products / Custom Requests')
    .setRequired(false)
    .setHelpText('Share any specific extracts, blends, packaging, or private label requirements.');

  form.addMultipleChoiceItem()
    .setTitle('Estimated Monthly Volume (kg)')
    .setRequired(true)
    .setChoiceValues([
      'Sample / Pilot batches',
      '50 – 250 kg',
      '250 – 500 kg',
      '500 kg – 1 metric ton',
      '1 – 5 metric tons',
      '5+ metric tons'
    ]);

  form.addCheckboxItem()
    .setTitle('Intended Sales Channels')
    .setRequired(true)
    .setChoiceValues([
      'Wholesale / B2B distribution',
      'Retail shelves (brick-and-mortar)',
      'E-commerce / Online marketplace',
      'Corporate wellness programs',
      'Hospitality / HORECA',
      'Manufacturer / Ingredient supply',
      'Other'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Packaging Preference')
    .setRequired(false)
    .setChoiceValues([
      'Bulk sacks (20–25 kg)',
      'Food-service packaging',
      'Retail-ready packs',
      'Private label / custom packaging',
      'Undecided / need guidance'
    ]);

  // --- Section 4: Compliance & Capabilities ---
  form.addSectionHeaderItem().setTitle('Compliance & Operational Capabilities');

  form.addCheckboxItem()
    .setTitle('Documentation / Certifications Required')
    .setRequired(false)
    .setChoiceValues([
      'USDA Organic',
      'EU Organic',
      'Kosher',
      'Halal',
      'Lab-tested COA',
      'Phytosanitary Certificate',
      'Other / Unsure'
    ]);

  form.addParagraphTextItem()
    .setTitle('Distribution Network & Customer Base')
    .setRequired(true)
    .setHelpText('Describe your main customer types, sales channels, and geographic reach.');

  form.addParagraphTextItem()
    .setTitle('Storage / Warehousing Capacity')
    .setRequired(false)
    .setHelpText('Mention warehousing locations, temperature control, or special handling capabilities.');

  form.addParagraphTextItem()
    .setTitle('Experience with Superfoods or Health Products')
    .setRequired(false)
    .setHelpText('Share relevant background working with similar products or categories.');

  // --- Section 5: Additional Details ---
  form.addSectionHeaderItem().setTitle('Additional Information');

  form.addParagraphTextItem()
    .setTitle('References or Existing Supplier Partnerships')
    .setRequired(false)
    .setHelpText('Optional — list previous suppliers or key references.');

  form.addParagraphTextItem()
    .setTitle('Additional Notes or Questions')
    .setRequired(false)
    .setHelpText('Anything else you would like the Organiya team to know.');

  form.addMultipleChoiceItem()
    .setTitle('Interested in receiving product updates & brochures?')
    .setRequired(false)
    .setChoiceValues([
      'Yes, keep me updated',
      'No, contact me only about this application'
    ]);

  form.addCheckboxItem()
    .setTitle('Acknowledgement')
    .setRequired(true)
    .setChoiceValues([
      'I confirm that the information provided is accurate and I agree to be contacted by Organiya Global LLP.'
    ]);

  var formUrl = form.getEditUrl();
  Logger.log('Form created: ' + formUrl);
  Logger.log('Public URL: ' + form.getPublishedUrl());
  Logger.log('Use Send → <> in Google Forms to copy the embed iframe for distributorship.html.');
}



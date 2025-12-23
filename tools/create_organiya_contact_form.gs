/**
 * Creates the Organiya Global contact inquiry Google Form.
 *
 * Usage:
 * 1. Open https://script.google.com/ and create a new Apps Script project.
 * 2. Paste this entire file into the code editor (replace any default code).
 * 3. Click the Run ▶ button and authorize the script.
 * 4. The script logs the new Form URL and also opens it for you.
 */
function createOrganiyaContactForm() {
  var formTitle = 'Organiya Global • Contact & Export Inquiry';

  var form = FormApp.create(formTitle)
    .setIsQuiz(false)
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setConfirmationMessage(
      'Thank you! Our export team will review your inquiry and contact you within 24–48 hours.'
    )
    .setProgressBar(true)
    .setLimitOneResponsePerUser(false)
    .setShuffleQuestions(false);

  form.setDescription(
    'Share your business details, products of interest, and export requirements. Organiya Global LLP supplies premium Indian superfoods worldwide.'
  );

  // --- Section 1: Contact Details ---
  form.addSectionHeaderItem().setTitle('Contact Details');

  form.addTextItem()
    .setTitle('Full Name')
    .setRequired(true)
    .setHelpText('Primary contact person for this inquiry.');

  form.addTextItem()
    .setTitle('Company Name')
    .setRequired(true)
    .setHelpText('If you are an individual entrepreneur, mention your brand or trading name.');

  form.addTextItem()
    .setTitle('Email Address')
    .setRequired(true)
    .setHelpText('Please enter a valid email address.')
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsEmail()
        .build()
    );

  form.addTextItem()
    .setTitle('Phone / WhatsApp Number')
    .setRequired(false)
    .setHelpText('Include country code. Helps us reach you quickly across time zones.');

  form.addTextItem()
    .setTitle('Website or Social Profile')
    .setRequired(false)
    .setHelpText('Optional — share a URL so we can learn more about your business.');

  // --- Section 2: Business & Location ---
  form.addSectionHeaderItem().setTitle('Business & Location');

  form.addTextItem()
    .setTitle('Country')
    .setRequired(true)
    .setHelpText('Where the products will be shipped or sold.');

  form.addMultipleChoiceItem()
    .setTitle('Business Type')
    .setRequired(true)
    .setChoiceValues([
      'Importer / Distributor',
      'Food & Beverage Manufacturer',
      'Retail / E-commerce',
      'Health & Wellness Brand',
      'Hospitality / Hotels',
      'Corporate Wellness Program',
      'Other'
    ])
    .setHelpText('Select the option that best describes your business model.');

  form.addMultipleChoiceItem()
    .setTitle('Years in Business')
    .setRequired(false)
    .setChoiceValues([
      '< 1 year',
      '1 – 3 years',
      '3 – 5 years',
      '5+ years',
      'Startup / In planning'
    ]);

  // --- Section 3: Product Interests ---
  form.addSectionHeaderItem().setTitle('Product Interests & Requirements');

  form.addCheckboxItem()
    .setTitle('Products Needed')
    .setRequired(true)
    .setChoiceValues([
      'Moringa Leaf Powder',
      'Turmeric Powder',
      'Ashwagandha Root Powder',
      'Spirulina Powder',
      'Beetroot Powder',
      'Amla (Indian Gooseberry) Powder',
      'Custom Herbal Blends',
      'Other (please specify below)'
    ])
    .setHelpText('Select all that apply. You can specify additional products in the next question.');

  form.addParagraphTextItem()
    .setTitle('Additional Products or Specifications')
    .setRequired(false)
    .setHelpText('Mention extracts, granulations, private label requirements, or custom blends.');

  form.addMultipleChoiceItem()
    .setTitle('Estimated Order Quantity')
    .setRequired(true)
    .setChoiceValues([
      'Sample / Pilot Batch',
      '50 – 250 kg',
      '250 – 500 kg',
      '500 kg – 1 metric ton',
      '1 – 5 metric tons',
      '5+ metric tons',
      'Not sure yet'
    ]);

  form.addCheckboxItem()
    .setTitle('Preferred Packaging Format')
    .setRequired(false)
    .setChoiceValues([
      'Bulk sacks (20–25 kg)',
      'Food-service packaging',
      'Retail-ready / Private label packaging',
      'Custom packaging (describe below)',
      'Not sure — need guidance'
    ]);

  form.addCheckboxItem()
    .setTitle('Intended Use / Market Segment')
    .setRequired(false)
    .setChoiceValues([
      'Retail Stores',
      'E-commerce / D2C',
      'Sports & Fitness Nutrition',
      'Functional Foods & Beverages',
      'Hospitality / HORECA',
      'Corporate Wellness',
      'Manufacturing / Private Label',
      'Other'
    ]);

  // --- Section 4: Compliance & Logistics ---
  form.addSectionHeaderItem().setTitle('Compliance & Logistics');

  form.addCheckboxItem()
    .setTitle('Certification or Documentation Requirements')
    .setRequired(false)
    .setChoiceValues([
      'USDA Organic',
      'EU Organic',
      'FSSAI',
      'FDA compliant facility',
      'Kosher',
      'Halal',
      'Third-party lab testing',
      'Certificates of Analysis (COA)',
      'Phytosanitary Certificate',
      'Not sure — need guidance',
      'Other (please describe in message)'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Desired Timeline')
    .setRequired(false)
    .setChoiceValues([
      'Immediate (within 2 weeks)',
      '1 – 2 months',
      '3 – 6 months',
      'Exploratory / Research phase'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Preferred Shipping Method')
    .setRequired(false)
    .setChoiceValues([
      'FOB India',
      'CIF / Door-to-port',
      'Air freight',
      'Sea freight',
      'Not sure yet'
    ]);

  // --- Section 5: Message & Opt-in ---
  form.addSectionHeaderItem().setTitle('Project Details');

  form.addParagraphTextItem()
    .setTitle('Project Details / Message')
    .setRequired(true)
    .setHelpText('Share product specifications, application, target market, or any questions you have for our export team.');

  form.addMultipleChoiceItem()
    .setTitle('How did you hear about Organiya Global?')
    .setRequired(false)
    .setChoiceValues([
      'Referral / Existing customer',
      'Search engine (Google, Bing, etc.)',
      'Trade show or event',
      'Social media',
      'Industry publication or article',
      'Other'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Would you like to receive product updates & brochures?')
    .setRequired(false)
    .setChoiceValues([
      'Yes, please keep me updated',
      'No, only contact me regarding this inquiry'
    ]);

  // Final touches.
  form.setAllowResponseEdits(false);

  var formUrl = form.getEditUrl();
  Logger.log('Form created: ' + formUrl);
  Logger.log('Public URL: ' + form.getPublishedUrl());

  Logger.log('Copy the embed code via Send → <> in the Google Form editor.');
}


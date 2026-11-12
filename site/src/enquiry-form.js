import {inquiries,products,esc} from './runtime.js';
function optionalField(key){
 const f=inquiries.fields[key],label=esc(f.label);
 const control=f.options?`<select name="${key}"><option value="">Prefer to discuss</option>${f.options.map(o=>`<option>${esc(o)}</option>`).join('')}</select>`:`<input name="${key}" type="${f.type||'text'}" maxlength="${f.max}" ${key==='organisation'?'autocomplete="organization"':''}>`;
 return `<label class="field"><span>${label} <small>(optional)</small></span>${control}${f.hint?`<small class="field-hint">${esc(f.hint)}</small>`:''}</label>`;
}
export function enquiryForm(business=false){return `<div class="email-panel"><h2>${esc(inquiries.heading)}</h2><p>${esc(inquiries.intro)}</p><form data-inquiry-form data-default-purpose="${business?'retail':''}" class="inquiry-form" method="post" action="/api/inquiry">
 <div data-inquiry-fields><p class="form-required">Name, email, reason and message are required. Other details are optional.</p>
 <div class="inquiry-grid"><label class="field"><span>Your name</span><input name="name" autocomplete="name" maxlength="100" required></label><label class="field"><span>Email address</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label></div>
 <label class="field"><span>Reason for contacting us</span><select name="purpose" required><option value="">Please select</option>${inquiries.purposes.map(p=>`<option value="${p.id}" ${business&&p.id==='retail'?'selected':''}>${esc(p.label)}</option>`).join('')}</select></label>
 ${inquiries.purposes.map(p=>`<div data-purpose-fields="${p.id}" hidden><p class="field-hint">A few optional details can help us respond.</p>${p.fields.map(optionalField).join('')}</div>`).join('')}
 <label class="field"><span>Product interest <small>(optional)</small></span><select name="interestScope">${inquiries.scopes.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('')}</select></label>
 <fieldset data-specific-products hidden><legend>Which products interest you?</legend>${products.map(p=>`<label class="product-choice"><input type="checkbox" name="productIds" value="${p.slug}"><span>${esc(p.name)}</span></label>`).join('')}</fieldset>
 <label class="field" data-unlisted-interest hidden><span>Product not shown <small>(optional)</small></span><input name="unlistedInterest" maxlength="150" placeholder="Tell us what you are looking for"></label>
 <label class="field"><span>Your message</span><textarea name="message" rows="5" minlength="10" maxlength="4000" required placeholder="Tell us what you need or would like to discuss."></textarea></label>
 <details class="contact-preference"><summary>Prefer a phone call? <span>+</span></summary><label class="field"><span>Preferred reply</span><select name="preferredContact"><option value="email">Email</option><option value="phone">Phone</option></select></label><label class="field" data-phone-field hidden><span>Phone number with country code</span><input name="phone" type="tel" autocomplete="tel" maxlength="40" placeholder="+91 …"></label><p class="field-hint">A contact preference is not permission for marketing or WhatsApp messages.</p></details>
 <div class="form-trap" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
 <label class="consent-field"><input type="checkbox" name="consent" required><span>Organiya may use these details to respond to my enquiry. <a href="/privacy/">How we use your information</a>.</span></label>
 <p class="form-required">The enquiry includes its source page and recognised campaign codes. We do not request your GPS location or store raw IP addresses with enquiries.</p>
 <div data-turnstile></div><button class="button" type="submit" data-enhancement hidden>Send enquiry ↗</button><noscript><p>Please enable JavaScript to use the enquiry form, or try another browser.</p></noscript></div>
 <p data-form-status role="status" aria-live="polite" tabindex="-1"></p><button type="button" class="text-link" data-send-another hidden>Send another enquiry</button></form></div>`;}

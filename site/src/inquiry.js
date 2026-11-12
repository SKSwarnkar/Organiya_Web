import {site,inquiries,products,esc} from './runtime.js';
import {photo} from './components.js';
let widget=null,started=false,attribution={};
const paths=()=>['/','/snacks/','/our-story/','/distributors/','/contact/','/privacy/',...products.map(p=>'/snacks/'+p.slug+'/')];
function safePath(v){return paths().includes(v)?v:'';}
function referrerGroup(){try{const u=new URL(document.referrer);if(u.origin===location.origin)return 'internal';for(const host of ['google.com','bing.com','linkedin.com','instagram.com','facebook.com','whatsapp.com'])if(u.hostname===host||u.hostname.endsWith('.'+host))return host;return 'other';}catch{return 'unknown';}}
export function initAttribution(){
 const q=new URLSearchParams(location.search),codes={};
 for(const key of ['source','medium','campaign']){const v=q.get('utm_'+key);codes[key]=inquiries.campaigns[key].includes(v)?v:'unknown';}
 const entryPath=safePath(q.get('entry'))||safePath(location.pathname);
 attribution={entryPath,sourcePath:safePath(q.get('from'))||safePath(location.pathname),sourceProduct:products.some(p=>p.slug===q.get('product'))?q.get('product'):(products.find(p=>'/snacks/'+p.slug+'/'===safePath(q.get('from')))?.slug||''),cta:inquiries.ctaIds.includes(q.get('cta'))?q.get('cta'):location.pathname==='/distributors/'?'distributor-form':'contact-form',referrer:referrerGroup(),...codes};
 // Recognised campaign codes only. No cookies, browser storage or tracking requests.
 for(const a of document.querySelectorAll('a[data-nav]')){const u=new URL(a.href);if(u.origin!==location.origin||!safePath(u.pathname))continue;
  for(const key of ['source','medium','campaign'])if(codes[key]!=='unknown')u.searchParams.set('utm_'+key,codes[key]);
  if(Object.values(codes).some(v=>v!=='unknown'))u.searchParams.set('entry',entryPath);
  if(u.pathname==='/contact/')u.searchParams.set('from',safePath(location.pathname));
  a.href=u.pathname+u.search+u.hash;
 }
}
export function initInquiry(){
 const form=document.querySelector('[data-inquiry-form]');if(!form||started)return;started=true;
 const status=form.querySelector('[data-form-status]'),submit=form.querySelector('[type=submit]'),q=new URLSearchParams(location.search);
 const field=n=>form.querySelector('[name="'+n+'"]');
 const feedback=(message,error=false)=>{status.textContent=message;status.classList.toggle('is-error',error);};
 const selected=products.find(p=>p.slug===q.get('product'));
 const purpose=inquiries.purposes.some(p=>p.id===q.get('purpose'))?q.get('purpose'):q.get('audience')==='business'?'retail':form.dataset.defaultPurpose||(selected?'product':'');
 field('purpose').value=purpose;
 if(selected){field('interestScope').value='specific';form.querySelector('[name=productIds][value="'+selected.slug+'"]').checked=true;
  const aside=document.querySelector('[data-source-product]');if(aside){aside.hidden=false;aside.innerHTML=photo(selected)+`<div><p class="eyebrow">YOU ARRIVED FROM</p><h2>${esc(selected.name)}</h2><p class="field-hint">You can choose different interests in the form.</p></div>`;}
 }else if(inquiries.scopes.some(s=>s.id===q.get('scope')))field('interestScope').value=q.get('scope');
 else if(purpose==='regulatory')field('interestScope').value='none';
 const show=(el,on)=>{el.hidden=!on;el.querySelectorAll('input,select,textarea').forEach(i=>i.disabled=!on);};
 const sync=()=>{
  form.querySelectorAll('[data-purpose-fields]').forEach(e=>show(e,e.dataset.purposeFields===field('purpose').value));
  show(form.querySelector('[data-specific-products]'),field('interestScope').value==='specific');
  show(form.querySelector('[data-unlisted-interest]'),field('interestScope').value==='unlisted');
  show(form.querySelector('[data-phone-field]'),field('preferredContact').value==='phone');
  field('phone').required=field('preferredContact').value==='phone';
 };sync();form.addEventListener('change',sync);
 const mount=()=>{if(widget!==null||!window.turnstile)return;widget=window.turnstile.render(form.querySelector('[data-turnstile]'),{sitekey:site.inquiry.siteKey,action:'inquiry',size:'compact',theme:'light','error-callback':()=>feedback('The security check could not load. Please try again later.',true),'expired-callback':()=>feedback('The security check expired. Please complete it again.',true)});};
 const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=mount;script.onerror=()=>feedback('The security check could not load. Please try again later.',true);document.head.append(script);
 let requestId=crypto.randomUUID(),previousBody='',retryAt=0;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submit.disabled||!form.reportValidity())return;
  if(Date.now()<retryAt){feedback('Please wait '+Math.ceil((retryAt-Date.now())/1000)+' seconds before trying again.',true);status.focus();return;}
  const token=widget!==null?window.turnstile.getResponse(widget):'';
  if(!token){feedback('Please complete the security check before sending.',true);status.focus();return;}
  const values=new FormData(form),payload=Object.fromEntries(values);
  payload.productIds=values.getAll('productIds');payload.consent=values.get('consent')==='on';payload.schemaVersion=2;payload.noticeVersion=inquiries.noticeVersion;payload.attribution=attribution;
  if(payload.interestScope==='specific'&&!payload.productIds.length){feedback('Choose at least one product, or change your product interest.',true);status.focus();return;}
  const signature=JSON.stringify(payload);if(previousBody&&previousBody!==signature)requestId=crypto.randomUUID();previousBody=signature;payload.requestId=requestId;payload.token=token;
  submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');feedback('Sending your message…');
  try{
   const response=await fetch(site.inquiry.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)});
   const result=await response.json().catch(()=>({}));
   if(response.status===429)retryAt=Date.now()+Math.min(86400,Number(response.headers.get('Retry-After'))||60)*1000;
   if(!response.ok||result.ok!==true)throw Error(result.error||(response.status===429?'Too many requests. Please wait a minute and try again.':'Your message could not be sent. Please try again later.'));
   feedback('Thank you. Your enquiry has been accepted for delivery to Organiya. Reference: '+result.reference+'. Please keep this reference for follow-up.');
   form.querySelector('[data-inquiry-fields]').hidden=true;form.querySelector('[data-send-another]').hidden=false;status.focus();
  }catch(error){feedback(error.name==='TimeoutError'?'We could not confirm delivery. Keep this page open and retry after a short wait; the same enquiry will not be sent twice.':error instanceof TypeError?'Unable to connect. Please try again later.':error.message||'Unable to send. Please try again later.',true);status.focus();}
  finally{submit.disabled=false;submit.textContent='Send enquiry ↗';form.removeAttribute('aria-busy');if(widget!==null)window.turnstile.reset(widget);}
 });
 form.querySelector('[data-send-another]').addEventListener('click',()=>{form.reset();requestId=crypto.randomUUID();previousBody='';retryAt=0;sync();form.querySelector('[data-inquiry-fields]').hidden=false;form.querySelector('[data-send-another]').hidden=true;feedback('');field('name').focus();});
}

import {site} from './runtime.js';
let widget=null,started=false;
export function initInquiry(){
 const form=document.querySelector('[data-inquiry-form]');if(!form||started)return;started=true;
 const status=form.querySelector('[data-form-status]'),submit=form.querySelector('[type=submit]');
 const feedback=(message,error=false)=>{status.textContent=message;status.classList.toggle('is-error',error);};
 const mount=()=>{if(widget!==null||!window.turnstile)return;widget=window.turnstile.render(form.querySelector('[data-turnstile]'),{sitekey:site.inquiry.siteKey,action:'inquiry',size:'compact',theme:'light','error-callback':()=>feedback('The security check could not load. Please try again later.',true),'expired-callback':()=>feedback('The security check expired. Please complete it again.',true)});};
 const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=mount;script.onerror=()=>feedback('The security check could not load. Please try again later.',true);document.head.append(script);
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submit.disabled||!form.reportValidity())return;
  const token=widget!==null?window.turnstile.getResponse(widget):'';
  if(!token){feedback('Please complete the security check before sending.',true);status.focus();return;}
  const values=new FormData(form),payload=Object.fromEntries(values);payload.consent=values.get('consent')==='on';payload.token=token;
  submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');feedback('Sending your message…');
  try{
   const response=await fetch(site.inquiry.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)});
   const result=await response.json().catch(()=>({}));
   if(!response.ok||result.ok!==true)throw Error(result.error||'Your message could not be sent. Please try again later.');
   feedback('Thank you. Your message has been sent to Organiya. We’ll reply to the email address you provided.');
   form.querySelector('[data-inquiry-fields]').hidden=true;form.querySelector('[data-send-another]').hidden=false;status.focus();
  }catch(error){
   feedback(error.name==='TimeoutError'?'We could not confirm delivery. Please wait before retrying.':error instanceof TypeError?'Unable to connect. Please try again later.':error.message||'Unable to send. Please try again later.',true);status.focus();
  }finally{submit.disabled=false;submit.textContent='Send inquiry ↗';form.removeAttribute('aria-busy');if(widget!==null)window.turnstile.reset(widget);}
 });
 form.querySelector('[data-send-another]').addEventListener('click',()=>{for(const name of ['name','email','message','company','phone'])form.elements[name].value='';form.elements.consent.checked=false;form.querySelector('[data-inquiry-fields]').hidden=false;form.querySelector('[data-send-another]').hidden=true;feedback('');form.elements.name.focus();});
}
export function syncInquiry(business){
 const form=document.querySelector('[data-inquiry-form]');if(!form)return;
 form.elements.audience.value=business?'business':'consumer';
 form.querySelector('[data-business-fields]').hidden=!business;
 const heading=document.querySelector('.email-panel h2');if(heading)heading.textContent=business?'Tell us about your business.':'What’s on your mind?';
}


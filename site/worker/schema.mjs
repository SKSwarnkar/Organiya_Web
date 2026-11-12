import config from '../content/inquiries.json' with {type:'json'};
export function validateInquiry(data,products){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Please complete the form.');
 const text=(key,max,required=false)=>{const v=data[key]??'';if(typeof v!=='string'||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v))throw Error('Please check the '+key+' field.');const t=v.trim();if(required&&!t)throw Error('Please complete the '+key+' field.');return t;};
 const name=text('name',100,true),email=text('email',254,true),message=text('message',4000,true);
 if(/[\r\n]/.test(name+email)||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw Error('Please enter a valid name and email address.');
 if(message.length<10)throw Error('Please include at least 10 characters in your message.');
 if(data.consent!==true)throw Error('Please confirm we may use these details to respond.');
 const legacy=data.schemaVersion===undefined;
 if(!legacy&&data.schemaVersion!==2)throw Error('Please refresh the page and try again.');
 if(legacy&&!['consumer','business'].includes(data.audience))throw Error('Please select an enquiry type.');
 const purpose=legacy?(data.audience==='business'?'retail':'product'):data.purpose,definition=config.purposes.find(p=>p.id===purpose);
 if(!definition)throw Error('Please select a reason for contacting us.');
 const scope=legacy?'specific':data.interestScope;
 if(!config.scopes.some(s=>s.id===scope))throw Error('Please choose your product interest.');
 const ids=legacy?[data.product]:(data.productIds??[]);
 if(!Array.isArray(ids)||ids.length>6||new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'||!Object.hasOwn(products,id))||(scope==='specific'?!ids.length:ids.length>0))throw Error('Please check your selected products.');
 const extras={};for(const key of definition.fields){const f=config.fields[key];const v=legacy&&key==='organisation'?text('company',150):text(key,f.max||100);if(/[\r\n]/.test(v)||f.options&&v&&!f.options.includes(v))throw Error('Please check '+f.label+'.');if(key==='businessWebsite'&&v){let u;try{u=new URL(v)}catch{throw Error('Please enter a full business website address.')}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Please check the business website.');}if(v)extras[key]=v;}
 const preferredContact=legacy?'email':data.preferredContact||'email',phone=text('phone',40);
 if(!['email','phone'].includes(preferredContact)||/[\r\n]/.test(phone)||preferredContact==='phone'&&(!/^\+[\d ()-]{7,38}$/.test(phone)||phone.replace(/\D/g,'').length<7||phone.replace(/\D/g,'').length>15))throw Error('Please include a phone number with country code, or choose email.');
 const requestId=legacy?'':text('requestId',36,true);if(!legacy&&!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId))throw Error('Please refresh the page before sending.');
 if(!legacy&&data.noticeVersion!==config.noticeVersion)throw Error('Please refresh the page to see the current privacy notice.');
 const unlistedInterest=scope==='unlisted'?text('unlistedInterest',150):'';
 const raw=data.attribution&&typeof data.attribution==='object'?data.attribution:{},attribution={};
 const paths=['/','/snacks/','/our-story/','/distributors/','/contact/','/privacy/',...Object.keys(products).map(p=>'/snacks/'+p+'/')];
 for(const key of ['entryPath','sourcePath'])attribution[key]=paths.includes(raw[key])?raw[key]:'unknown';
 attribution.sourceProduct=Object.hasOwn(products,raw.sourceProduct??'')?raw.sourceProduct:'';
 attribution.cta=config.ctaIds.includes(raw.cta)?raw.cta:'unknown';
 attribution.referrer=['internal','google.com','bing.com','linkedin.com','instagram.com','facebook.com','whatsapp.com','other'].includes(raw.referrer)?raw.referrer:'unknown';
 for(const key of ['source','medium','campaign'])attribution[key]=config.campaigns[key].includes(raw[key])?raw[key]:'unknown';
 return {name,email,message,purpose,purposeLabel:definition.label,interestScope:scope,productIds:ids,productNames:ids.map(id=>products[id]),unlistedInterest,extras,preferredContact,phone:preferredContact==='phone'||legacy?phone:'',attribution,noticeVersion:legacy?'2026-11-12-v1':config.noticeVersion,requestId};
}

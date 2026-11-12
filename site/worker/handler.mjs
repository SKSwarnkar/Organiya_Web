import {validateInquiry} from './schema.mjs';
export {validateInquiry};
const reply=(status,data,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Organiya-Form':'2',...headers}});
const unavailable=()=>reply(503,{error:'We could not confirm that your enquiry was sent. Please keep this page open and try again later.'},{'Retry-After':'60'});
const limited=seconds=>reply(429,{error:'We are receiving several enquiries. Please try again after '+(seconds>3600?'a few hours':Math.ceil(seconds/60)+' minutes')+'. Your message remains on this page.'},{'Retry-After':String(seconds)});
async function fingerprints(values,ip,secret){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const digest=async(label,value)=>Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('organiya-v2:'+label+':'+value)))).map(b=>b.toString(16).padStart(2,'0')).join('');
 const {requestId,...body}=values;
 const result={};result.digest=await digest('body',JSON.stringify(body));result.id=await digest('id',requestId||result.digest);result.ipKey=await digest('ip',ip);result.emailKey=await digest('email',values.email.toLowerCase());result.duplicateKey=await digest('duplicate',JSON.stringify([values.email.toLowerCase(),values.purpose,values.message.toLowerCase().replace(/\s+/g,' ')]));result.reference='ORG-'+crypto.randomUUID();return result;
}
function emailMessage(v,reservation){
 const receivedAt=new Date().toISOString();
 const record={schemaVersion:1,reference:reservation.reference,receivedAt,purpose:v.purpose,name:v.name,email:v.email,organisation:v.extras.organisation||'',territory:v.extras.territory||v.extras.location||'',interests:v.interestScope==='specific'?v.productNames.join('; '):v.interestScope,unlistedInterest:v.unlistedInterest,source:v.attribution.source,medium:v.attribution.medium,campaign:v.attribution.campaign,sourcePage:v.attribution.sourcePath,entryPage:v.attribution.entryPath,cta:v.attribution.cta,sourceProduct:v.attribution.sourceProduct,owner:'Organiya founder',status:'New',nextAction:'Review and respond',dueDate:'',firstResponseAt:'',lastContactAt:'',outcome:'',notes:'',test:false,repeatedEmail:reservation.repeatedEmail};
 return {subject:'[Organiya]['+v.purposeLabel+'] '+reservation.reference,text:[
 'New Organiya enquiry','Reference: '+reservation.reference,'Received (UTC): '+receivedAt,'Reason: '+v.purposeLabel,'Name: '+v.name,'Email (visitor-provided, unverified): '+v.email,'Interest: '+(v.interestScope==='specific'?v.productNames.join(', '):v.interestScope),...(v.unlistedInterest?['Product not shown: '+v.unlistedInterest]:[]),...Object.entries(v.extras).map(([k,val])=>k+': '+val),'Preferred reply: '+v.preferredContact,...(v.phone?['Phone: '+v.phone]:[]),'','Message:',v.message,'','Attribution (browser-provided, not independently verified):',...Object.entries(v.attribution).map(([k,val])=>k+': '+val),'',reservation.repeatedEmail?'Review signal: this claimed email appeared more than 3 times in an hour. This is not proof of spam.':'',reservation.capacityWarning?'Capacity warning: '+reservation.hour+'/25 hourly send attempts; '+reservation.day+'/100 daily send attempts.':'','Response permission recorded. Notice: '+v.noticeVersion+'. Not a marketing subscription.','Import the following record into the private local lead register:','ORGANIYA_RECORD_START',JSON.stringify(record),'ORGANIYA_RECORD_END'
 ].filter(x=>x!==undefined).join('\n')};
}
export async function handleInquiry(request,env,{verifyFetch=fetch,products={}}={}){
 const u=new URL(request.url);
 if(u.pathname!=='/api/inquiry')return reply(404,{error:'Not found'});
 if(request.method!=='POST')return reply(405,{error:'Use the enquiry form.'});
 if(request.headers.get('Origin')!==env.SITE_ORIGIN)return reply(403,{error:'Please send your enquiry from the Organiya website.'});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply(415,{error:'Unsupported request format.'});
 if(env.DISABLE_SEND==='true'||!env.EMAIL||!env.TURNSTILE_SECRET||!env.INQUIRY_TO||!env.ABUSE_KEY||!env.INQUIRY_LIMITER||!env.INQUIRY_GUARD)return unavailable();
 if(Number(request.headers.get('Content-Length'))>24000)return reply(413,{error:'Your message is too long.'});
 const ip=request.headers.get('CF-Connecting-IP');if(!ip)return unavailable();
 try{if(!(await env.INQUIRY_LIMITER.limit({key:ip})).success)return limited(60);}catch{return unavailable();}
 let data,values;
 try{
  const reader=request.body?.getReader();if(!reader)throw Error('Please complete the form.');let size=0;const chunks=[];
  while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>24000){await reader.cancel();return reply(413,{error:'Your message is too long.'});}chunks.push(part.value);}
  const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}data=JSON.parse(new TextDecoder().decode(bytes));
  if(typeof data.website!=='string'||data.website)return reply(400,{error:'Unable to submit this enquiry.'});values=validateInquiry(data,products);
 }catch(e){return reply(400,{error:e instanceof SyntaxError?'Please complete the form.':e.message});}
 if(typeof data.token!=='string'||!data.token||data.token.length>2048)return reply(400,{error:'Please complete the security check and try again.'});
 let guard,keys;
 try{
  const response=await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:data.token,remoteip:ip}),signal:AbortSignal.timeout(10000)});if(!response.ok)return unavailable();
  const check=await response.json();if(!check.success||check.hostname!==new URL(env.SITE_ORIGIN).hostname||check.action!=='inquiry')return reply(400,{error:'The security check expired or failed. Please try again.'});
  keys=await fingerprints(values,ip,env.ABUSE_KEY);guard=env.INQUIRY_GUARD.get(env.INQUIRY_GUARD.idFromName('organiya-global-enquiries-v2'));
  const reserveResponse=await guard.fetch('https://internal/reserve',{method:'POST',body:JSON.stringify({operation:'reserve',payload:keys})});if(!reserveResponse.ok)return unavailable();const reservation=await reserveResponse.json();
  if(reservation.kind==='limited')return limited(reservation.retryAfter);
  if(reservation.kind==='conflict')return reply(409,{error:'This enquiry reference was used with different details. Please refresh the page before sending a new enquiry.'});
  if(reservation.kind==='uncertain')return unavailable();
  if(reservation.kind==='duplicate')return reply(200,{ok:true,reference:reservation.reference});
  if(reservation.kind!=='reserved')return unavailable();
  if(reservation.capacityWarning)console.warn(JSON.stringify({event:'enquiry_capacity_warning',hour:reservation.hour,day:reservation.day}));
  await env.EMAIL.send({from:{email:'website@organiyaglobal.com',name:'Organiya website'},to:env.INQUIRY_TO,replyTo:{email:values.email,name:values.name},...emailMessage(values,reservation)});
  const saved=await guard.fetch('https://internal/complete',{method:'POST',body:JSON.stringify({operation:'complete',payload:{id:keys.id,digest:keys.digest,status:'accepted'}})});if(!saved.ok)return unavailable();
  return reply(200,{ok:true,reference:reservation.reference});
 }catch{
  if(guard&&keys)try{await guard.fetch('https://internal/complete',{method:'POST',body:JSON.stringify({operation:'complete',payload:{id:keys.id,digest:keys.digest,status:'unknown'}})});}catch{}
  return unavailable();
 }
}

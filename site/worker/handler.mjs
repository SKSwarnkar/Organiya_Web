const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const unavailable=()=>reply(503,{error:'We could not send your message. Please try again or email info@organiyaglobal.com.'});
export function validateInquiry(data,products){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Please complete the form.');
 const text=(key,max,required=false)=>{const v=data[key];if(typeof v!=='string'||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v))throw Error('Please check the '+key+' field.');const t=v.trim();if(required&&!t)throw Error('Please complete the '+key+' field.');return t;};
 const name=text('name',100,true),email=text('email',254,true),message=text('message',4000,true),company=text('company',150),phone=text('phone',40);
 if(/[\r\n]/.test(name+email+company+phone)||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw Error('Please enter a valid name and email address.');
 if(message.length<10)throw Error('Please include at least 10 characters in your message.');
 if(!['consumer','business'].includes(data.audience))throw Error('Please select an inquiry type.');
 if(!Object.hasOwn(products,data.product))throw Error('Please select a product.');
 if(data.consent!==true)throw Error('Please confirm we may use these details to respond.');
 return {name,email,message,company,phone,audience:data.audience,product:products[data.product]};
}
export async function handleInquiry(request,env,{verifyFetch=fetch,products={}}={}){
 const u=new URL(request.url);
 if(u.pathname!=='/api/inquiry')return reply(404,{error:'Not found'});
 if(request.method!=='POST')return reply(405,{error:'Use the inquiry form.'});
 if(request.headers.get('Origin')!==env.SITE_ORIGIN)return reply(403,{error:'Please send your inquiry from the Organiya website.'});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply(415,{error:'Unsupported request format.'});
 if(!env.EMAIL||!env.TURNSTILE_SECRET||!env.INQUIRY_TO)return unavailable();
 if(Number(request.headers.get('Content-Length'))>24000)return reply(413,{error:'Your message is too long.'});
 let data,values;
 try{
  const reader=request.body?.getReader();if(!reader)throw Error('Please complete the form.');
  let size=0;const chunks=[];while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>24000){await reader.cancel();return reply(413,{error:'Your message is too long.'});}chunks.push(part.value);}
  const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
  data=JSON.parse(new TextDecoder().decode(bytes));
  if(typeof data.website!=='string'||data.website)return reply(400,{error:'Unable to submit this inquiry.'});
  values=validateInquiry(data,products);
 }catch(e){return reply(400,{error:e instanceof SyntaxError?'Please complete the form.':e.message});}
 if(typeof data.token!=='string'||!data.token||data.token.length>2048)return reply(400,{error:'Please complete the security check and try again.'});
 try{
  const response=await verifyFetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:data.token,remoteip:request.headers.get('CF-Connecting-IP')}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return unavailable();
  const check=await response.json();
  if(!check.success||check.hostname!==new URL(env.SITE_ORIGIN).hostname||check.action!=='inquiry')return reply(400,{error:'The security check expired or failed. Please try again.'});
  const reference=crypto.randomUUID();
  await env.EMAIL.send({from:{email:'website@organiyaglobal.com',name:'Organiya website'},to:env.INQUIRY_TO,replyTo:{email:values.email,name:values.name},subject:'Organiya '+(values.audience==='business'?'business':'product')+' inquiry · '+values.product,text:[
   'New website inquiry','Reference: '+reference,'Name: '+values.name,'Email: '+values.email,'Product: '+values.product,'Inquiry type: '+values.audience,
   ...(values.company?['Company: '+values.company]:[]),...(values.phone?['Phone: '+values.phone]:[]),'','Message:',values.message,'','The visitor agreed to use these details to respond. This is not a marketing subscription.'
  ].join('\n')});
  return reply(200,{ok:true,reference});
 }catch{return unavailable();}
}


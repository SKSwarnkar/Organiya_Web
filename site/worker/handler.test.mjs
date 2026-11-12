import {test} from 'node:test';import assert from 'node:assert/strict';import {handleInquiry} from './handler.mjs';
const products={chia:'Chia Crunch Sticks'},data={name:'Visitor',email:'visitor@example.com',message:'Please share more details.',company:'',phone:'',product:'chia',audience:'consumer',website:'',consent:true,token:'valid'};
const origin='https://organiyaglobal.com';
function setup(options={}){
 const sent=[],env={SITE_ORIGIN:origin,TURNSTILE_SECRET:'test-only',INQUIRY_TO:'team@example.com',EMAIL:{send:async value=>{sent.push(value);if(options.sendFails)throw Error('provider failure')}}};
 const request=new Request(origin+'/api/inquiry',{method:'POST',headers:{Origin:options.origin||origin,'Content-Type':'application/json'},body:options.raw??JSON.stringify({...data,...options.data})});
 const verifyFetch=async()=>Response.json({success:options.valid!==false,hostname:options.hostname||'organiyaglobal.com',action:options.action||'inquiry'});
 return {sent,run:()=>handleInquiry(request,env,{products,verifyFetch})};
}
test('valid inquiry sends to configured inbox with visitor reply-to',async()=>{const t=setup(),r=await t.run();assert.equal(r.status,200);assert.equal((await r.json()).ok,true);assert.equal(t.sent[0].to,'team@example.com');assert.equal(t.sent[0].replyTo.email,data.email);assert.match(t.sent[0].text,/Chia Crunch Sticks/);});
test('does not accept caller-controlled recipients',async()=>{const t=setup({data:{to:'attacker@example.com',from:'attacker@example.com'}});assert.equal((await t.run()).status,200);assert.equal(t.sent[0].to,'team@example.com');assert.equal(t.sent[0].from.email,'website@organiyaglobal.com');});
for(const [name,options,status] of [
 ['wrong origin',{origin:'https://evil.example'},403],['invalid email',{data:{email:'x\r\nBcc: thief@example.com'}},400],
 ['unrecognised product',{data:{product:'anything'}},400],['missing consent',{data:{consent:false}},400],
 ['spam trap',{data:{website:'bot'}},400],['invalid token',{valid:false},400],['wrong token hostname',{hostname:'elsewhere.example'},400],
 ['wrong token action',{action:'login'},400],['missing token',{data:{token:''}},400],['invalid JSON',{raw:'not-json'},400],
 ['oversize body',{raw:JSON.stringify({...data,message:'x'.repeat(25000)})},413]
])test(name,async()=>{const t=setup(options);assert.equal((await t.run()).status,status);assert.equal(t.sent.length,0);});
test('delivery errors never return a success state',async()=>{const t=setup({sendFails:true}),r=await t.run();assert.equal(r.status,503);assert.equal((await r.json()).ok,undefined)});
test('missing mail configuration fails closed',async()=>{const r=await handleInquiry(new Request(origin+'/api/inquiry',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),{SITE_ORIGIN:origin},{products});assert.equal(r.status,503)});


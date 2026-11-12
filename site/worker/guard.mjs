const HOUR=3600000,DAY=24*HOUR;
// Pure policy is used by the SQLite actor and concurrency/window tests.
export function reserveDecision(events,p,now){
 const rows=events.filter(e=>e.created>now-DAY),same=rows.find(e=>e.id===p.id);
 if(same)return same.digest!==p.digest?{kind:'conflict'}:{kind:same.status==='accepted'?'duplicate':'uncertain',reference:same.reference};
 const duplicate=rows.find(e=>e.duplicateKey===p.duplicateKey&&e.created>now-600000);
 if(duplicate)return {kind:duplicate.status==='accepted'?'duplicate':'uncertain',reference:duplicate.reference};
 const hour=rows.filter(e=>e.created>now-HOUR),ip=hour.filter(e=>e.ipKey===p.ipKey);
 const retryAfter=values=>Math.max(1,Math.ceil((Math.min(...values)-now)/1000));
 if(rows.length>=100)return {kind:'limited',retryAfter:retryAfter(rows.map(e=>e.created+DAY))};
 if(hour.length>=25)return {kind:'limited',retryAfter:retryAfter(hour.map(e=>e.created+HOUR))};
 if(ip.length>=10)return {kind:'limited',retryAfter:retryAfter(ip.map(e=>e.created+HOUR))};
 return {kind:'reserved',reference:p.reference,hour:hour.length+1,day:rows.length+1,repeatedEmail:hour.filter(e=>e.emailKey===p.emailKey).length>=3,capacityWarning:hour.length+1>=20||rows.length+1>=80};
}
export class InquiryGuard {
 constructor(ctx){this.ctx=ctx;this.sql=ctx.storage.sql;this.sql.exec('CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, digest TEXT, duplicateKey TEXT, ipKey TEXT, emailKey TEXT, created INTEGER, status TEXT, reference TEXT)');}
 async fetch(request){
  const {operation,payload:p}=await request.json();
  if(operation==='reserve'){
   const result=this.ctx.storage.transactionSync(()=>{const now=Date.now();this.sql.exec('DELETE FROM attempts WHERE created <= ?',now-DAY);const rows=this.sql.exec('SELECT * FROM attempts').toArray();const result=reserveDecision(rows,p,now);if(result.kind==='reserved')this.sql.exec('INSERT INTO attempts VALUES (?, ?, ?, ?, ?, ?, ?, ?)',p.id,p.digest,p.duplicateKey,p.ipKey,p.emailKey,now,'pending',p.reference);return result;});
   if(result.kind==='reserved'&&!await this.ctx.storage.getAlarm())await this.ctx.storage.setAlarm(Date.now()+DAY);
   return Response.json(result);
  }
  if(operation==='complete'){
   if(!['accepted','unknown'].includes(p.status))return new Response('Invalid state',{status:400});
   this.sql.exec('UPDATE attempts SET status = ? WHERE id = ? AND digest = ?',p.status,p.id,p.digest);return Response.json({ok:true});
  }
  return new Response('Not found',{status:404});
 }
 async alarm(){this.sql.exec('DELETE FROM attempts WHERE created <= ?',Date.now()-DAY);if(this.sql.exec('SELECT COUNT(*) AS n FROM attempts').one().n)await this.ctx.storage.setAlarm(Date.now()+DAY);}
}

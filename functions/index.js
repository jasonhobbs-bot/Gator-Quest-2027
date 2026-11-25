'use strict';
const {onRequest}=require('firebase-functions/v2/https');
const {defineSecret,defineString}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,Timestamp}=require('firebase-admin/firestore');
const {randomBytes,createHash,createHmac,timingSafeEqual}=require('node:crypto');
const {matches,grades,eastern,openMatches,winnerOptions}=require('./core');
initializeApp();const db=getFirestore();
const PIN=defineSecret('GQ_STAFF_PIN'),KEY=defineSecret('GQ_SESSION_KEY');
const STAFF=defineString('GQ_STAFF_EMAIL'),ORIGIN=defineString('GQ_SITE_ORIGIN');
const stateRef=db.doc('gq2027/state');
const stateOf=s=>s.exists?s.data():{enabled:false,winners:{},station:null};
const hash=s=>createHash('sha256').update(s).digest('hex');
const sign=s=>createHmac('sha256',KEY.value()).update(s).digest('base64url');
const eq=(a,b)=>{a=Buffer.from(a);b=Buffer.from(b);return a.length===b.length&&timingSafeEqual(a,b)};
function fail(message,status=400){const e=new Error(message);e.status=status;throw e}
async function staff(req){let id;try{id=await getAuth().verifyIdToken(String(req.headers.authorization||'').replace(/^Bearer /,''));}catch{fail('Sign in with your staff Google account.',401)}if(!id.email_verified||String(id.email||'').toLowerCase()!==STAFF.value().trim().toLowerCase())fail('This Google account is not authorized.',403);return id;}
function issue(uid){const p=Buffer.from(JSON.stringify({uid,exp:Date.now()+10*60*1000})).toString('base64url');return p+'.'+sign(p)}
function session(uid,t){try{const [p,s,extra]=String(t||'').split('.');if(extra||!p||!s||!eq(sign(p),s))throw Error();const data=JSON.parse(Buffer.from(p,'base64url'));if(data.uid!==uid||data.exp<=Date.now())throw Error()}catch{fail('Staff session expired. Enter your PIN again.',401)}}
function station(s,t,now){if(typeof t!=='string'||!/^[0-9a-f]{32}$/.test(t)||!s.station||s.station.expires<=now.getTime()||!eq(s.station.hash,hash(t)))fail('Voting station closed or invalid. Ask staff to open a station.',403);return s.station;}
const countRef=id=>db.doc('gq2027/state/totals/'+id);
exports.api=onRequest({region:'us-central1',secrets:[PIN,KEY],maxInstances:5,timeoutSeconds:20},async(req,res)=>{
 const origin=req.get('Origin');if(origin&&origin!==ORIGIN.value()){res.status(403).json({error:'Origin not allowed.'});return}if(origin)res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');res.set('Access-Control-Allow-Methods','POST, OPTIONS');res.set('Access-Control-Allow-Headers','Content-Type, Authorization');res.set('Cache-Control','no-store');if(req.method==='OPTIONS'){res.status(204).end();return}if(req.method!=='POST'){res.status(405).json({error:'Use POST.'});return}
 try{const b=req.body||{},now=new Date();if(typeof b!=='object'||JSON.stringify(b).length>4096)fail('Invalid request.');const a=b.action;
  if(a==='status'){const s=stateOf(await stateRef.get());return res.json({enabled:!!s.enabled,winners:s.winners||{},clock:eastern(now),open:openMatches(s,now).map(m=>m.id)});}
  if(a==='station'){const s=stateOf(await stateRef.get());station(s,b.station,now);return res.json({choices:openMatches(s,now),expires:s.station.expires,remaining:500-(s.station.used||0)});}
  if(a==='vote'){
   if(typeof b.requestId!=='string'||!/^[0-9a-f-]{36}$/.test(b.requestId)||!Number.isInteger(b.grade)||b.grade<0||b.grade>=grades.length)fail('Invalid ballot.');
   const result=await db.runTransaction(async tx=>{const s=stateOf(await tx.get(stateRef));if(typeof b.station!=='string'||!/^[0-9a-f]{32}$/.test(b.station))fail('Invalid station.',403);const receipt=db.doc('gq2027/state/receipts/'+hash(b.station+':'+b.requestId));const old=await tx.get(receipt);if(old.exists){const d=old.data();if(d.match!==b.match||d.grade!==b.grade||d.book!==b.book)fail('Retry must use the same ballot.',409);return {duplicate:true};}const at=new Date();station(s,b.station,at);const m=openMatches(s,at).find(m=>m.id===b.match);if(!m||![m.a,m.b].includes(b.book))fail('This matchup is not open for voting.',409);if((s.station.used||0)>=500)fail('Station ballot limit reached. Ask staff to reopen.',409);const ref=countRef(m.id),snap=await tx.get(ref),counts=snap.exists?snap.data().counts||{}:{};const g=String(b.grade);counts[g]=counts[g]||{};counts[g][b.book]=(counts[g][b.book]||0)+1;tx.set(ref,{counts});tx.set(receipt,{match:b.match,grade:b.grade,book:b.book,expiresAt:Timestamp.fromMillis(now.getTime()+86400000)});tx.set(stateRef,{...s,station:{...s.station,used:(s.station.used||0)+1}});return {duplicate:false}});return res.json({ok:true,...result});}
  const id=await staff(req);
  if(a==='unlock'){
   const pin=PIN.value();if(!/^\d{4}$/.test(pin))fail('Staff PIN is not configured.',503);const ref=db.doc('gq2027/state/auth/'+hash(id.uid));const result=await db.runTransaction(async tx=>{const snap=await tx.get(ref),d=snap.data()||{};if((d.until||0)>Date.now())return {locked:true};const valid=typeof b.pin==='string'&&/^\d{4}$/.test(b.pin)&&eq(pin,b.pin);if(valid){tx.set(ref,{count:0,until:0});return {ok:true}}const count=(d.until?0:d.count||0)+1;tx.set(ref,{count,until:count>=5?Date.now()+15*60*1000:0});return {locked:count>=5}});if(!result.ok)fail(result.locked?'Too many attempts. Try again in 15 minutes.':'Incorrect PIN.',403);return res.json({session:issue(id.uid)});}
  session(id.uid,b.session);
  if(a==='adminStatus'){const [s,...totals]=await db.getAll(stateRef,...matches.map(m=>countRef(m.id)));const state=stateOf(s);return res.json({enabled:!!state.enabled,winners:state.winners||{},stationOpen:!!state.station&&state.station.expires>Date.now(),stationUsed:state.station?.used||0,clock:eastern(now),counts:Object.fromEntries(matches.map((m,i)=>[m.id,totals[i].data()?.counts||{}]))});}
  if(a==='openStation'){const token=randomBytes(16).toString('hex'),expires=now.getTime()+90*60*1000;await db.runTransaction(async tx=>{const s=stateOf(await tx.get(stateRef));tx.set(stateRef,{...s,station:{hash:hash(token),expires,used:0}})});return res.json({station:token,expires});}
  if(a==='closeStation'||a==='enable'||a==='pause'){await db.runTransaction(async tx=>{const s=stateOf(await tx.get(stateRef));if(a==='closeStation')s.station=null;else s.enabled=a==='enable';tx.set(stateRef,s)});return res.json({ok:true});}
  if(a==='confirmWinner'){const m=matches.find(m=>m.id===b.match);if(!m)fail('Unknown matchup.');await db.runTransaction(async tx=>{const [ss,cs]=await tx.getAll(stateRef,countRef(m.id)),s=stateOf(ss);let opts;try{opts=winnerOptions(m,s,cs.data()?.counts||{},now)}catch(e){fail(e.message,409)}if(!opts.includes(b.book))fail('Choose the highest vote total; ties require a staff choice.',409);tx.set(stateRef,{...s,winners:{...s.winners,[m.id]:b.book}})});return res.json({ok:true});}
  fail('Unknown action.',404);
 }catch(e){if(!e.status)console.error('API operation failed',e.code||e.name);res.status(e.status||500).json({error:e.status?e.message:'The database operation could not be confirmed. Retry the same ballot or refresh.'});}
});

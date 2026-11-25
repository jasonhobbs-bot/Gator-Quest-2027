'use strict';
const {matches,grades}=require('./catalog.json');
function eastern(now){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));return {date:parts.year+'-'+parts.month+'-'+parts.day,time:parts.hour+':'+parts.minute};}
function contenders(m,winners={}){return [m.a||winners[m.sourceA]||null,m.b||winners[m.sourceB]||null];}
function openMatches(state,now){const c=eastern(now),w=state.winners||{};return matches.filter(m=>state.enabled&&m.date===c.date&&c.time>='07:30'&&c.time<'14:20'&&!w[m.id]&&contenders(m,w).every(Boolean)).map(m=>({...m,a:contenders(m,w)[0],b:contenders(m,w)[1]}));}
function winnerOptions(m,state,counts,now){const c=eastern(now);if(c.date<m.date||(c.date===m.date&&c.time<'14:20'))throw Error('Voting has not closed for this matchup.');if(state.winners?.[m.id])throw Error('Winner already confirmed.');const [a,b]=contenders(m,state.winners);if(!a||!b)throw Error('Both contenders must be confirmed.');const total=id=>grades.reduce((sum,_,i)=>sum+(counts?.[String(i)]?.[id]||0),0);const at=total(a),bt=total(b);if(at+bt===0)throw Error('No official votes to confirm.');return at===bt?[a,b]:[at>bt?a:b];}
module.exports={matches,grades,eastern,contenders,openMatches,winnerOptions};

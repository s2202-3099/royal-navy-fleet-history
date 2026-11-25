// Regenerate data.csv from data.json:  node tools/make-csv.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const D=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
const q=s=>s==null?'':/[",\n]/.test(String(s))?`"${String(s).replace(/"/g,'""')}"`:String(s);
const keys=[...new Set(D.eras.flatMap(e=>e.cats.map(c=>c.key)))];
const rows=[['era','date','label',...keys,'total_known','partial','accuracy','sources'].join(',')];
for(const E of D.eras) for(const k of E.order){
  const d=E.points[k];let t=0,part=!!(d.min&&d.min.length);
  const vals=keys.map(key=>{const inEra=E.cats.some(c=>c.key===key);if(!inEra) return '';const v=d[key];if(v==null){part=true;return '';}t+=v;return ((d.min||[]).includes(key)?'>=':'')+v;});
  rows.push([E.id,k,d.lb||k,...vals,t,part?1:0,d.acc,(d.src||[]).join(' ')].map(q).join(','));
}
fs.writeFileSync(path.join(root,'data.csv'),rows.join('\n')+'\n');
const pr=['date,value,scope,sources',...D.personnel.series.map(s=>[s.date,s.value,s.scope,s.src.join(' ')].map(q).join(','))];
fs.writeFileSync(path.join(root,'personnel.csv'),pr.join('\n')+'\n');
console.log('wrote data.csv ('+(rows.length-1)+' rows), personnel.csv ('+(pr.length-1)+' rows)');

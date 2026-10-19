const {hcSim,pvYearFactor}=require('./engine.js');
// growing annuity closed form (end-of-year version adjusted by monthly factor)
const p={age:45,retire:60,income:72e6,g:0.03,spend:42e6,inf:0.025,d:0.06,assets:4e8};
const r=hcSim(p);
const f=pvYearFactor(0.06); let cf=0; for(let k=0;k<15;k++) cf+=72e6*Math.pow(1.03,k)/Math.pow(1.06,k);
const closed=72e6*f*(1-Math.pow(1.03/1.06,15))/(1-1.03/1.06);
console.log('hc',Math.round(r.hc),'loop',Math.round(cf*f),'closed',Math.round(closed),'nominal',Math.round(r.nominal));
// monthly factor sanity: d=0 -> 1 ; pv of 12 monthly 1/12 at 6%
console.log('f(0)',pvYearFactor(0),'f(6%)',f.toFixed(5));
let s=0;const m=Math.pow(1.06,1/12)-1;for(let i=1;i<=12;i++) s+=1/12/Math.pow(1+m,i); console.log('direct',s.toFixed(5));
console.log('cross',r.cross&&r.cross.age,'path0 H',Math.round(r.path[0].H),'pvSave',Math.round(r.pvSave));

const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const errors = [];
if (!Array.isArray(input.stages) || input.stages.length < 2) errors.push('至少需要两个转化阶段');
const stages = (Array.isArray(input.stages) ? input.stages : []).map((stage, index) => {
  const count = Number(stage.count);
  if (!Number.isFinite(count) || count < 0) errors.push(`阶段${index + 1}人数必须是大于或等于0的有限数值`);
  return {name:String(stage.name || `阶段${index + 1}`), count:Number.isFinite(count) && count >= 0 ? count : 0};
});
if (errors.length) {
  console.log(JSON.stringify({status:'invalid',formula_version:'1.0.1',errors}, null, 2));
  process.exit(2);
}
const stageRates = stages.slice(1).map((stage, index) => {
  const previous = stages[index];
  return {from: previous.name, to: stage.name, rate: previous.count ? Number((stage.count / previous.count).toFixed(4)) : null};
});
const cumulativeRate = stages.length > 1 && stages[0].count ? Number((stages[stages.length - 1].count / stages[0].count).toFixed(4)) : null;
const dropOff = stages.slice(1).map((stage, index) => ({from:stages[index].name,to:stage.name,dropped:Math.max(0,stages[index].count-stage.count)}));
console.log(JSON.stringify({status:'ok',formula_version:'1.0.1',stages,stageRates,cumulativeRate,dropOff,warnings:cumulativeRate===null?['起始阶段人数为零，累计转化率不可计算']:[]}, null, 2));

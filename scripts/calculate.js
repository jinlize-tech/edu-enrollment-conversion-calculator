const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const stages = (input.stages || []).map(stage => ({name:String(stage.name), count:Number(stage.count || 0)}));
const stageRates = stages.slice(1).map((stage, index) => {
  const previous = stages[index];
  return {from: previous.name, to: stage.name, rate: previous.count ? Number((stage.count / previous.count).toFixed(4)) : null};
});
const cumulativeRate = stages.length > 1 && stages[0].count ? Number((stages[stages.length - 1].count / stages[0].count).toFixed(4)) : null;
console.log(JSON.stringify({status:'ok',formula_version:'1.0.0',stages,stageRates,cumulativeRate}, null, 2));

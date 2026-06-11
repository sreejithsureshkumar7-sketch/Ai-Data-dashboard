function makeInsight(){
  if(!records.length)return 'No data available.';
  const top=[...records].sort((a,b)=>b.value-a.value)[0];
  const low=[...records].sort((a,b)=>a.score-b.score)[0];
  const avg=Math.round(records.reduce((s,r)=>s+r.score,0)/records.length);
  return `AI Insight: ${top.name} has the highest value. ${low.name} needs improvement. Overall performance is ${avg}%.`;
}
function askAI(){
  const q=document.getElementById('question').value.toLowerCase();
  let ans='AI Answer: ';
  if(q.includes('highest')||q.includes('top')) ans += [...records].sort((a,b)=>b.value-a.value)[0].name + ' is highest by value.';
  else if(q.includes('risk')||q.includes('low')) ans += [...records].sort((a,b)=>a.score-b.score)[0].name + ' has lowest score and needs attention.';
  else if(q.includes('average')) ans += 'Average score is ' + Math.round(records.reduce((s,r)=>s+r.score,0)/records.length) + '%.';
  else ans += makeInsight();
  document.getElementById('aiAnswer').textContent=ans;
}
async function generateAIReport(){
  alert(makeInsight() + '\n\nGemini/OpenAI real API can be connected in js/ai.js.');
}
// Gemini API placeholder:
// const GEMINI_API_KEY = 'PASTE_YOUR_KEY_HERE';

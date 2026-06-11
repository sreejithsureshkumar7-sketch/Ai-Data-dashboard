const GEMINI_API_KEY = prompt("Enter Gemini API Key");

function makeInsight(){
  if(!records.length) return "No data available.";
  const top = [...records].sort((a,b)=>b.value-a.value)[0];
  const low = [...records].sort((a,b)=>a.score-b.score)[0];
  const avg = Math.round(records.reduce((s,r)=>s+r.score,0)/records.length);
  return AI Insight: ${top.name} has the highest value. ${low.name} needs improvement. Overall performance is ${avg}%.;
}

function askAI(){
  const q = document.getElementById("question").value.toLowerCase();
  let ans = "AI Answer: ";
  if(q.includes("highest") || q.includes("top")) ans += [...records].sort((a,b)=>b.value-a.value)[0].name + " is highest.";
  else if(q.includes("risk") || q.includes("low")) ans += [...records].sort((a,b)=>a.score-b.score)[0].name + " has lowest score.";
  else if(q.includes("average")) ans += "Average score is " + Math.round(records.reduce((s,r)=>s+r.score,0)/records.length);
  else ans += makeInsight();
  document.getElementById("aiAnswer").textContent = ans;
}

async function generateAIReport() {
  const summary = makeInsight();

  const response = await fetch(
    https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Analyze this dashboard data and give short insights: " + summary
          }]
        }]
      })
    }
  );

  const data = await response.json();

  alert(
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No AI response"
  );
}

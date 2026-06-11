let dashboardData = [
  { month: 'Jan', revenue: 12000, category: 'Students', score: 72 },
  { month: 'Feb', revenue: 18500, category: 'Sales', score: 81 },
  { month: 'Mar', revenue: 16000, category: 'Cyber Logs', score: 68 },
  { month: 'Apr', revenue: 22000, category: 'Students', score: 89 },
  { month: 'May', revenue: 26000, category: 'Sales', score: 93 },
  { month: 'Jun', revenue: 31000, category: 'Cyber Logs', score: 86 }
];
let lineChart, pieChart, barChart;

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('dashboardData');
  if (saved) dashboardData = JSON.parse(saved);
  renderDashboard();
  document.getElementById('csvFile').addEventListener('change', importCSV);
  document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('light'));
});

function saveData(){ localStorage.setItem('dashboardData', JSON.stringify(dashboardData)); }

function renderDashboard(){
  updateCards(); renderTable(); renderCharts(); generateInsights(); saveData();
}
function updateCards(){
  const total = dashboardData.length;
  const revenue = dashboardData.reduce((s,d)=>s+Number(d.revenue),0);
  const avg = Math.round(dashboardData.reduce((s,d)=>s+Number(d.score),0) / Math.max(total,1));
  const growth = total > 1 ? dashboardData[total-1].revenue - dashboardData[total-2].revenue : 0;
  document.getElementById('totalRecords').innerText = total;
  document.getElementById('totalRevenue').innerText = '₹' + revenue.toLocaleString('en-IN');
  document.getElementById('avgScore').innerText = avg + '%';
  document.getElementById('prediction').innerText = growth >= 0 ? 'Growth +' + growth : 'Drop ' + growth;
}
function renderTable(){
  document.getElementById('dataTable').innerHTML = dashboardData.map(d => `<tr><td>${d.month}</td><td>₹${Number(d.revenue).toLocaleString('en-IN')}</td><td>${d.category}</td><td>${d.score}%</td></tr>`).join('');
}
function renderCharts(){
  const months = dashboardData.map(d=>d.month);
  const revenues = dashboardData.map(d=>d.revenue);
  const scores = dashboardData.map(d=>d.score);
  const cats = {};
  dashboardData.forEach(d => cats[d.category] = (cats[d.category] || 0) + 1);
  if(lineChart) lineChart.destroy(); if(pieChart) pieChart.destroy(); if(barChart) barChart.destroy();
  lineChart = new Chart(document.getElementById('lineChart'), {type:'line',data:{labels:months,datasets:[{label:'Revenue',data:revenues,tension:.4}]},options:{responsive:true}});
  pieChart = new Chart(document.getElementById('pieChart'), {type:'doughnut',data:{labels:Object.keys(cats),datasets:[{data:Object.values(cats)}]},options:{responsive:true}});
  barChart = new Chart(document.getElementById('barChart'), {type:'bar',data:{labels:months,datasets:[{label:'Score %',data:scores}]},options:{responsive:true,scales:{y:{beginAtZero:true,max:100}}}});
}
function generateInsights(){
  const box = document.getElementById('aiInsights');
  const revenue = dashboardData.map(d=>Number(d.revenue));
  const scores = dashboardData.map(d=>Number(d.score));
  const last = revenue.at(-1) || 0;
  const prev = revenue.at(-2) || 0;
  const avgScore = Math.round(scores.reduce((a,b)=>a+b,0)/Math.max(scores.length,1));
  const best = dashboardData.reduce((a,b)=>Number(a.revenue)>Number(b.revenue)?a:b, dashboardData[0]);
  let insights = [];
  insights.push(last >= prev ? `Revenue is increasing. Latest month improved by ₹${(last-prev).toLocaleString('en-IN')}.` : `Revenue decreased by ₹${(prev-last).toLocaleString('en-IN')}. Check weak category performance.`);
  insights.push(`Average performance score is ${avgScore}%. ${avgScore >= 80 ? 'Overall performance is strong.' : 'Need improvement in low-score months.'}`);
  insights.push(`Best revenue month is ${best.month} with ₹${Number(best.revenue).toLocaleString('en-IN')}.`);
  insights.push(`AI forecast: next month expected revenue around ₹${Math.round(last * 1.12).toLocaleString('en-IN')} if current trend continues.`);
  box.innerHTML = insights.map(i=>`<div class="insight">${i}</div>`).join('');
}
function importCSV(e){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = function(){
    const lines = reader.result.trim().split('\n').slice(1);
    dashboardData = lines.map(line => {
      const [month,revenue,category,score] = line.split(',');
      return {month:month.trim(), revenue:Number(revenue), category:category.trim(), score:Number(score)};
    });
    renderDashboard();
  };
  reader.readAsText(file);
}
function loadSampleData(){
  dashboardData = [
    { month: 'Jul', revenue: 34000, category: 'Students', score: 91 },
    { month: 'Aug', revenue: 28000, category: 'Sales', score: 77 },
    { month: 'Sep', revenue: 39000, category: 'Cyber Logs', score: 88 },
    { month: 'Oct', revenue: 42000, category: 'Students', score: 95 }
  ]; renderDashboard();
}
function clearData(){ dashboardData=[]; renderDashboard(); }
function exportPDF(){
  const { jsPDF } = window.jspdf; const doc = new jsPDF();
  doc.setFontSize(18); doc.text('AI Data Analytics Dashboard Report', 14, 18);
  doc.setFontSize(11); let y=32;
  dashboardData.forEach((d,i)=>{ doc.text(`${i+1}. ${d.month} | Revenue: Rs.${d.revenue} | Category: ${d.category} | Score: ${d.score}%`,14,y); y+=8; });
  doc.save('ai-dashboard-report.pdf');
}
function exportExcel(){
  const ws = XLSX.utils.json_to_sheet(dashboardData);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Data');
  XLSX.writeFile(wb, 'ai-dashboard-data.xlsx');
}

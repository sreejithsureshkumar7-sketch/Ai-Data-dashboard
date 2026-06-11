let records = [
  {name:'Product A', value:12000, score:82},
  {name:'Product B', value:18000, score:91},
  {name:'Product C', value:9000, score:63},
  {name:'Product D', value:24000, score:96}
];
let barChart,lineChart,pieChart;

document.getElementById('themeBtn')?.addEventListener('click',()=>document.body.classList.toggle('dark'));
document.getElementById('csvInput')?.addEventListener('change', importCSV);

function addData(){
  const name=document.getElementById('name').value.trim();
  const value=Number(document.getElementById('value').value);
  const score=Number(document.getElementById('score').value);
  if(!name || !value || !score){alert('All fields required');return}
  records.push({name,value,score});
  document.getElementById('name').value='';document.getElementById('value').value='';document.getElementById('score').value='';
  updateDashboard();
}
function status(score){return score>=80?'Good':score>=60?'Average':'Risk'}
function renderTable(){
  const search=(document.getElementById('search')?.value||'').toLowerCase();
  const body=document.getElementById('dataBody'); if(!body)return;
  body.innerHTML='';
  records.filter(r=>r.name.toLowerCase().includes(search)).forEach(r=>{
    const cls=r.score>=80?'good':r.score>=60?'warn':'bad';
    body.innerHTML+=`<tr><td>${r.name}</td><td>₹${r.value}</td><td>${r.score}%</td><td class="${cls}">${status(r.score)}</td></tr>`;
  });
}
function updateCards(){
  const total=records.reduce((s,r)=>s+r.value,0);
  const avg=records.length?Math.round(records.reduce((s,r)=>s+r.score,0)/records.length):0;
  document.getElementById('totalRecords').textContent=records.length;
  document.getElementById('totalSales').textContent='₹'+total.toLocaleString('en-IN');
  document.getElementById('avgScore').textContent=avg+'%';
  document.getElementById('riskLevel').textContent=avg<60?'High':avg<80?'Medium':'Low';
  document.getElementById('aiInsight').textContent=makeInsight();
}
function drawCharts(){
  const labels=records.map(r=>r.name), values=records.map(r=>r.value), scores=records.map(r=>r.score);
  [barChart,lineChart,pieChart].forEach(c=>c&&c.destroy());
  barChart=new Chart(document.getElementById('barChart'),{type:'bar',data:{labels,datasets:[{label:'Value',data:values}]},options:{responsive:true,maintainAspectRatio:false}});
  lineChart=new Chart(document.getElementById('lineChart'),{type:'line',data:{labels,datasets:[{label:'Score %',data:scores}]},options:{responsive:true,maintainAspectRatio:false}});
  pieChart=new Chart(document.getElementById('pieChart'),{type:'pie',data:{labels,datasets:[{label:'Value Share',data:values}]},options:{responsive:true,maintainAspectRatio:false}});
}
function importCSV(e){
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    const lines=reader.result.split('\n').slice(1);
    records=[];
    lines.forEach(line=>{const [name,value,score]=line.split(','); if(name&&value&&score)records.push({name:name.trim(),value:Number(value),score:Number(score)});});
    updateDashboard();
  };
  reader.readAsText(file);
}
function updateDashboard(){renderTable();updateCards();drawCharts();}
updateDashboard();

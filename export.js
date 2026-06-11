function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18); doc.text('AI Data Analytics Report', 14, 20);
  doc.setFontSize(11); doc.text(makeInsight(), 14, 32, {maxWidth:180});
  let y=50; records.forEach((r,i)=>{doc.text(`${i+1}. ${r.name} | Value: Rs.${r.value} | Score: ${r.score}% | ${status(r.score)}`,14,y); y+=8;});
  doc.save('ai-analytics-report.pdf');
}
function exportExcel(){
  const ws=XLSX.utils.json_to_sheet(records);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Analytics Data');
  XLSX.writeFile(wb,'ai-analytics-data.xlsx');
}

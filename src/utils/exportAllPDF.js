import { jsPDF } from "jspdf";

export function exportAllJournalsPDF(journals) {

  if (journals.length === 0) {
    alert("Belum ada journal untuk diexport.");
    return;
  }
  
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("JOURNALLY", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Complete Journal Report", 105, 28, {
    align: "center",
  });

  let y = 45;

  journals.forEach((journal, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Journal #${index + 1}`, 20, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Title : ${journal.title}`, 20, y);

    y += 8;

    doc.text(`Date : ${journal.date}`, 20, y);

    y += 8;

    doc.text(
      `Mood : ${journal.mood.replace(/[^\x00-\x7F]/g, "")}`,
      20,
      y
    );

    y += 8;

    doc.text(`Tag : ${journal.tag}`, 20, y);

    y += 10;

    const content = doc.splitTextToSize(
      journal.content,
      170
    );

    doc.text(content, 20, y);

    y += content.length * 7 + 10;

    doc.line(20, y, 190, y);

    y += 12;
  });

  doc.save("All-Journals.pdf");
}
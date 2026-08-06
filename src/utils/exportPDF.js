import { jsPDF } from "jspdf";

export function exportJournalPDF(journal) {
  const doc = new jsPDF();

  // HEADER
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("JOURNALLY", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Daily Journal Report", 105, 28, {
    align: "center",
  });

  // Garis
  doc.line(20, 35, 190, 35);

  let y = 50;

  doc.setFont("helvetica", "bold");
  doc.text("Title", 20, y);

  doc.setFont("helvetica", "normal");
  doc.text(journal.title, 60, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Date", 20, y);

  doc.setFont("helvetica", "normal");
  doc.text(journal.date, 60, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Mood", 20, y);

  doc.setFont("helvetica", "normal");
  doc.text(journal.mood.replace(/[^\x00-\x7F]/g, ""), 60, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Tag", 20, y);

  doc.setFont("helvetica", "normal");
  doc.text(journal.tag, 60, y);

  y += 18;

  doc.line(20, y, 190, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Content", 20, y);

  y += 10;

  doc.setFont("helvetica", "normal");

  const content = doc.splitTextToSize(
    journal.content,
    170
  );

  doc.text(content, 20, y);

  doc.save(`${journal.title}.pdf`);
}
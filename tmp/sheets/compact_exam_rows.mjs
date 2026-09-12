import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx";
const outputPath = sourcePath;
const monthOrder = ["April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hindiMonth = { April: "अप्रैल", May: "मई", June: "जून", July: "जुलाई", August: "अगस्त", September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर" };
const examTitles = {
  "UT 1": "अप्रैल से जुलाई तक के अध्याय एवं विषय",
  "UT 2": "अगस्त माह के अध्याय एवं विषय",
  "Half Yearly": "अप्रैल से अक्टूबर तक का संचयी पाठ्यक्रम",
  "UT 3": "नवंबर माह के अध्याय एवं विषय",
  "UT 4": "दिसंबर माह के अध्याय एवं विषय",
  "Annual": "संपूर्ण वार्षिक पाठ्यक्रम",
};

const glossary = [
  [/History of prose literature/gi, "गद्य साहित्य का इतिहास"],
  [/History of poetry/gi, "काव्य साहित्य का इतिहास"],
  [/Prose completed/gi, "गद्य खंड पूर्ण"],
  [/Prose/gi, "गद्य"], [/Poetry/gi, "पद्य"], [/Grammar/gi, "व्याकरण"],
  [/Writing skills/gi, "लेखन कौशल"], [/Reading skills practice/gi, "पठन कौशल अभ्यास"],
  [/Reading unit/gi, "पठन इकाई"], [/Writing unit/gi, "लेखन इकाई"],
  [/Unit/gi, "इकाई"], [/Chapter/gi, "अध्याय"], [/Lesson/gi, "पाठ"],
  [/completed/gi, "पूर्ण"], [/complete/gi, "पूर्ण"], [/begins/gi, "आरंभ"],
  [/begins/gi, "आरंभ"], [/continues/gi, "जारी"], [/remaining/gi, "शेष"],
  [/revision/gi, "पुनरावृत्ति"], [/practical work/gi, "प्रायोगिक कार्य"],
  [/project work/gi, "परियोजना कार्य"], [/summer vacation homework/gi, "ग्रीष्मावकाश गृहकार्य"],
  [/Summer homework/gi, "ग्रीष्मावकाश गृहकार्य"], [/and/gi, "और"],
  [/Science/gi, "विज्ञान"], [/Mathematics/gi, "गणित"], [/Social Science/gi, "सामाजिक विज्ञान"],
  [/Home Science/gi, "गृह विज्ञान"], [/English/gi, "अंग्रेज़ी"], [/Hindi/gi, "हिंदी"],
  [/Food and Nutrition/gi, "भोजन एवं पोषण"], [/First Aid/gi, "प्राथमिक उपचार"],
  [/Home Nursing/gi, "गृह परिचर्या"], [/Sanskrit/gi, "संस्कृत"],
  [/Linear Equations in Two Variables/gi, "दो चरों के रैखिक समीकरण"],
  [/Coordinate Geometry/gi, "निर्देशांक ज्यामिति"], [/Number Systems/gi, "संख्या पद्धति"],
  [/Polynomials/gi, "बहुपद"], [/Algebra/gi, "बीजगणित"],
];
const toHindi = (text) => glossary.reduce((out, [rx, hindi]) => out.replace(rx, hindi), text)
  .replace(/\bApril\b/gi, "अप्रैल").replace(/\bMay\b/gi, "मई").replace(/\bJune\b/gi, "जून")
  .replace(/\bJuly\b/gi, "जुलाई").replace(/\bAugust\b/gi, "अगस्त").replace(/\bSeptember\b/gi, "सितंबर")
  .replace(/\bOctober\b/gi, "अक्टूबर").replace(/\bNovember\b/gi, "नवंबर").replace(/\bDecember\b/gi, "दिसंबर");

function monthFrom(row) {
  const text = `${row[6] ?? ""} ${row[8] ?? ""}`;
  return monthOrder.find((month) => new RegExp(`\\b${month}\\b`, "i").test(text)) ?? "";
}

function englishTopic(detail, month) {
  const escaped = month.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`PDF-prescribed topic for ${escaped}:\\s*([\\s\\S]+)$`, "i"),
    new RegExp(`through ${escaped}:\\s*([\\s\\S]+)$`, "i"),
    /Included in the complete Annual syllabus:\s*([\s\S]+)$/i,
  ];
  for (const pattern of patterns) {
    const match = String(detail ?? "").match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return String(detail ?? "").replace(/^.*?:\s*/, "").trim();
}

const input = await FileBlob.load(sourcePath);
const sourceBook = await SpreadsheetFile.importXlsx(input);
const sourceSheet = sourceBook.worksheets.getItem("Syllabus_Template");
const used = sourceSheet.getUsedRange();
const oldRows = sourceSheet.getRange(`A2:L${used.rowCount}`).values;
const groups = new Map();
for (const row of oldRows) {
  const [serial, grade, section, subject, term, exam, title, hindiTitle, detail, practical, status, remarks] = row;
  if (!grade || !subject || !exam) continue;
  const key = [grade, section, subject, exam].join("\u0001");
  if (!groups.has(key)) groups.set(key, { grade, section, subject, term, exam, entries: [], practicals: [], status: status || "Not Done", remarks: remarks || "" });
  const group = groups.get(key);
  const month = monthFrom(row);
  const topic = englishTopic(detail, month);
  if (topic && !group.entries.some((entry) => entry.month === month && entry.topic === topic)) group.entries.push({ month, topic });
  if (practical && !group.practicals.includes(practical)) group.practicals.push(practical);
}

const assessmentSequence = ["UT 1", "UT 2", "Half Yearly", "UT 3", "UT 4", "Annual"];
const compactRows = [...groups.values()]
  .sort((a, b) => Number(String(a.grade).replace(/\D/g, "")) - Number(String(b.grade).replace(/\D/g, "")) || String(a.section).localeCompare(String(b.section)) || String(a.subject).localeCompare(String(b.subject)) || assessmentSequence.indexOf(a.exam) - assessmentSequence.indexOf(b.exam))
  .map((group, index) => {
    const entries = group.entries.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    const details = entries.map((entry, i) => {
      const hi = toHindi(entry.topic);
      return `${i + 1}. ${hindiMonth[entry.month] ?? entry.month}: ${hi} / ${entry.month}: ${entry.topic}`;
    }).join("\n\n");
    const practical = group.practicals.map((item, i) => `${i + 1}. ${item}`).join("\n\n");
    return [index + 1, group.grade, group.section, group.subject, group.term, group.exam, examTitles[group.exam] ?? "पाठ्यक्रम विवरण", examTitles[group.exam] ?? "पाठ्यक्रम विवरण", details, practical, group.status, group.remarks];
  });

const template = await FileBlob.load("input/template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(template);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
const lastRow = compactRows.length + 1;
sheet.getRange(`A2:L${lastRow}`).copyFrom(sheet.getRange("A2:L2"), "all");
sheet.getRange(`A2:L${lastRow}`).clear({ applyTo: "contents" });
sheet.getRange(`A2:L${lastRow}`).values = compactRows;
sheet.getRange(`A2:L${lastRow}`).format.wrapText = true;
sheet.getRange(`A2:L${lastRow}`).format.verticalAlignment = "top";
sheet.getRange(`A1:L${lastRow}`).format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
sheet.getRange(`A2:L${lastRow}`).format.autofitRows();
sheet.getRange(`G2:H${lastRow}`).format.font = { bold: true };
sheet.freezePanes.freezeRows(1);
workbook.recalculate();
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(JSON.stringify({ previousRows: oldRows.length, compactRows: compactRows.length, output: outputPath }));

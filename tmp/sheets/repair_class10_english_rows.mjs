import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const path = "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx";
const content = {
  "UT 1": `1. अप्रैल: पठन कौशल और व्याकरण की शुरुआत। / April: Reading skills and beginning grammar.\n\n2. मई: फर्स्ट फ्लाइट गद्य पाठ 1 से 3। / May: First Flight prose lessons 1 to 3.\n\n3. जून: फर्स्ट फ्लाइट गद्य पाठ 4 से 5। / June: First Flight prose lessons 4 to 5.\n\n4. जुलाई: फर्स्ट फ्लाइट गद्य पाठ 6 से 7 तथा UT-1 की तैयारी। / July: First Flight prose lessons 6 to 7 and UT-1 preparation.`,
  "UT 2": `1. अगस्त: फर्स्ट फ्लाइट गद्य पाठ 8 से 9। / August: First Flight prose lessons 8 to 9.`,
  "Half Yearly": `1. अप्रैल: पठन कौशल और व्याकरण की शुरुआत। / April: Reading skills and beginning grammar.\n\n2. मई: फर्स्ट फ्लाइट गद्य पाठ 1 से 3। / May: First Flight prose lessons 1 to 3.\n\n3. जून: फर्स्ट फ्लाइट गद्य पाठ 4 से 5। / June: First Flight prose lessons 4 to 5.\n\n4. जुलाई: फर्स्ट फ्लाइट गद्य पाठ 6 से 7। / July: First Flight prose lessons 6 to 7.\n\n5. अगस्त: फर्स्ट फ्लाइट गद्य पाठ 8 से 9। / August: First Flight prose lessons 8 to 9.\n\n6. सितंबर: कविताएँ—Dust of Snow, Fire and Ice और A Tiger in the Zoo। / September: Poems—Dust of Snow, Fire and Ice, and A Tiger in the Zoo.`,
  "UT 3": `1. नवंबर: शेष कविताएँ तथा फुटप्रिंट्स विदाउट फीट पाठ 1 से 4। / November: Remaining poems and Footprints Without Feet lessons 1 to 4.`,
  "UT 4": `1. दिसंबर: फुटप्रिंट्स विदाउट फीट पाठ 5 से 9। / December: Footprints Without Feet lessons 5 to 9.`,
  "Annual": `1. अप्रैल से अगस्त: फर्स्ट फ्लाइट के गद्य पाठ 1 से 9, पठन कौशल और व्याकरण। / April to August: First Flight prose lessons 1 to 9, reading skills and grammar.\n\n2. सितंबर: कविताएँ—Dust of Snow, Fire and Ice और A Tiger in the Zoo। / September: Poems—Dust of Snow, Fire and Ice, and A Tiger in the Zoo.\n\n3. नवंबर: शेष कविताएँ तथा फुटप्रिंट्स विदाउट फीट पाठ 1 से 4। / November: Remaining poems and Footprints Without Feet lessons 1 to 4.\n\n4. दिसंबर: फुटप्रिंट्स विदाउट फीट पाठ 5 से 9। / December: Footprints Without Feet lessons 5 to 9.`,
};
const terms = { "UT 1": "Apr - Jul", "UT 2": "Aug", "Half Yearly": "Apr - Oct", "UT 3": "Nov", "UT 4": "Dec", "Annual": "Apr - Dec" };
const titles = { "UT 1": "अप्रैल से जुलाई तक के अध्याय एवं विषय", "UT 2": "अगस्त माह के अध्याय एवं विषय", "Half Yearly": "अप्रैल से अक्टूबर तक का संचयी पाठ्यक्रम", "UT 3": "नवंबर माह के अध्याय एवं विषय", "UT 4": "दिसंबर माह के अध्याय एवं विषय", "Annual": "संपूर्ण वार्षिक पाठ्यक्रम" };
const order = ["UT 1", "UT 2", "Half Yearly", "UT 3", "UT 4", "Annual"];

const file = await FileBlob.load(path);
const workbook = await SpreadsheetFile.importXlsx(file);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
const used = sheet.getUsedRange();
let rows = sheet.getRange(`A2:L${used.rowCount}`).values;
const predicate = (row) => row[1] === "Class 10" && row[2] === "A" && row[3] === "SUB-117 / ENGLISH";
rows = rows.filter((row) => !predicate(row));
for (const exam of order) rows.push([0, "Class 10", "A", "SUB-117 / ENGLISH", terms[exam], exam, titles[exam], titles[exam], content[exam], "", "Not Done", ""]);
rows.sort((a, b) => Number(String(a[1]).replace(/\D/g, "")) - Number(String(b[1]).replace(/\D/g, "")) || String(a[2]).localeCompare(String(b[2])) || String(a[3]).localeCompare(String(b[3])) || order.indexOf(a[5]) - order.indexOf(b[5]));
rows = rows.map((row, index) => [index + 1, ...row.slice(1)]);
const lastRow = rows.length + 1;
sheet.getRange(`A2:L${lastRow}`).copyFrom(sheet.getRange("A2:L2"), "all");
sheet.getRange(`A2:L${lastRow}`).clear({ applyTo: "contents" });
sheet.getRange(`A2:L${lastRow}`).values = rows;
sheet.getRange(`A2:L${lastRow}`).format.wrapText = true;
sheet.getRange(`A2:L${lastRow}`).format.verticalAlignment = "top";
sheet.getRange(`A2:L${lastRow}`).format.autofitRows();
workbook.recalculate();
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(path);
console.log(JSON.stringify({ rows: rows.length, repaired: "Class 10 A English" }));

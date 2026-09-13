import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const templatePath = "input/template.xlsx";
const uploadPath = "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx";
const correctedTemplatePath = "output/Savitri_School_Syllabus_Sample_Template_Corrected.xlsx";

// Read the finished syllabus values first.
const current = await SpreadsheetFile.importXlsx(await FileBlob.load(uploadPath));
const currentSheet = current.worksheets.getItem("Syllabus_Template");
const currentUsed = currentSheet.getUsedRange();
const data = currentSheet.getRange(`A2:L${currentUsed.rowCount}`).values;

// Recreate the final ERP workbook from the untouched sample template. This keeps
// its original K-column status validation and removes any accidental extra rules.
const finalBook = await SpreadsheetFile.importXlsx(await FileBlob.load(templatePath));
const finalSheet = finalBook.worksheets.getItem("Syllabus_Template");
const lastRow = data.length + 1;
finalSheet.getRange(`A2:L${lastRow}`).copyFrom(finalSheet.getRange("A2:L2"), "all");
finalSheet.getRange(`A2:L${lastRow}`).clear({ applyTo: "contents" });
finalSheet.getRange(`A2:L${lastRow}`).values = data;
finalSheet.getRange(`A2:L${lastRow}`).format.wrapText = true;
finalSheet.getRange(`A2:L${lastRow}`).format.verticalAlignment = "top";
finalSheet.getRange(`A2:L${lastRow}`).format.autofitRows();
finalSheet.freezePanes.freezeRows(1);
// Project / Practical Work is deliberately free-text; Status dropdown stays on K.
finalSheet.getRange("J2:J1000").dataValidation = null;
finalBook.recalculate();
await fs.mkdir("output", { recursive: true });
let output = await SpreadsheetFile.exportXlsx(finalBook);
await output.save(uploadPath);

// Provide the corrected sample template with the same column mapping.
const sampleBook = await SpreadsheetFile.importXlsx(await FileBlob.load(templatePath));
const sampleSheet = sampleBook.worksheets.getItem("Syllabus_Template");
sampleSheet.getRange("J2:J1000").dataValidation = null;
sampleBook.recalculate();
output = await SpreadsheetFile.exportXlsx(sampleBook);
await output.save(correctedTemplatePath);

console.log(JSON.stringify({ uploadPath, correctedTemplatePath, records: data.length }));

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const files = [
  { source: "input/template.xlsx", target: "output/Savitri_School_Syllabus_Sample_Template_Corrected.xlsx", rows: 1000 },
  { source: "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx", target: "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx", rows: 1000 },
];

const statusValues = ["Not Done", "In Progress", "Done"];
for (const item of files) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(item.source));
  const sheet = workbook.worksheets.getItem("Syllabus_Template");
  const headers = sheet.getRange("A1:L1").values[0];
  const projectCol = headers.findIndex((cell) => /Project Work|Practical\s*\/\s*Lab Work/i.test(String(cell)));
  const statusCol = headers.findIndex((cell) => /^Status\s*\*/i.test(String(cell)));
  if (projectCol < 0 || statusCol < 0) throw new Error(`Required Project/Practical and Status columns were not found in ${item.source}`);
  const projectLetter = String.fromCharCode(65 + projectCol);
  const statusLetter = String.fromCharCode(65 + statusCol);
  // Project/Practical is free-text, so remove any inherited dropdown.
  sheet.getRange(`${projectLetter}2:${projectLetter}${item.rows}`).dataValidation = null;
  // Status is the only dropdown field, using the ERP-safe status values.
  sheet.getRange(`${statusLetter}2:${statusLetter}${item.rows}`).dataValidation = {
    allowBlank: true,
    list: { inCellDropDown: true, source: statusValues },
  };
  workbook.recalculate();
  await fs.mkdir("output", { recursive: true });
  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  await xlsx.save(item.target);
  console.log(JSON.stringify({ file: item.target, projectColumn: projectLetter, statusColumn: statusLetter, validationRange: `${statusLetter}2:${statusLetter}${item.rows}` }));
}

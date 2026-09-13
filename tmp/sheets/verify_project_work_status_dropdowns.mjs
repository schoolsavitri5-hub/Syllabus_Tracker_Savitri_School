import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const files = [
  "../../output/Savitri_School_Syllabus_Sample_Template_Corrected.xlsx",
  "../../output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx",
];
for (const path of files) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
  const sheet = workbook.worksheets.getItem("Syllabus_Template");
  const headers = sheet.getRange("A1:L1").values[0];
  const projectCol = headers.findIndex((cell) => /Project Work|Practical\s*\/\s*Lab Work/i.test(String(cell)));
  const statusCol = headers.findIndex((cell) => /^Status\s*\*/i.test(String(cell)));
  const projectLetter = String.fromCharCode(65 + projectCol);
  const statusLetter = String.fromCharCode(65 + statusCol);
  const projectValidation = sheet.getRange(`${projectLetter}2`).dataValidation;
  const statusValidation = sheet.getRange(`${statusLetter}2`).dataValidation;
  console.log(JSON.stringify({ path, projectColumn: projectLetter, statusColumn: statusLetter, projectValidation, statusValidation }, null, 2));
}

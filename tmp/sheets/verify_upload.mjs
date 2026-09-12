import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const file = await FileBlob.load("output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx");
const workbook = await SpreadsheetFile.importXlsx(file);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
console.log((await workbook.inspect({ kind: "workbook,sheet,region", sheetId: sheet.id, range: "A1:L12", maxChars: 8000, tableMaxRows: 12, tableMaxCols: 12, tableMaxCellChars: 300 })).ndjson);
const used = sheet.getUsedRange();
const values = sheet.getRange(`A2:L${used.rowCount}`).values;
const required = [0, 1, 3, 4, 5, 6, 8, 10];
const missing = values.flatMap((row, index) => required.filter((column) => !String(row[column] ?? "").trim()).map((column) => `row ${index + 2}, column ${column + 1}`));
const grades = [...new Set(values.map((row) => row[1]))];
const subjects = [...new Set(values.map((row) => row[3]))];
console.log(JSON.stringify({ rows: values.length, missingRequired: missing, grades, subjectCount: subjects.length, terms: [...new Set(values.map((row) => row[4]))] }));
const image = await workbook.render({ sheetName: "Syllabus_Template", range: "A1:L12", scale: 1.25, format: "png" });
await fs.writeFile("tmp/sheets/output_preview.png", new Uint8Array(await image.arrayBuffer()));

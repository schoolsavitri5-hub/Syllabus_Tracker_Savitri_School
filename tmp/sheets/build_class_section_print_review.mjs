import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const sourcePath = "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx";
const outputPath = "output/Savitri_School_Syllabus_Class_Section_Print_Review.xlsx";
const groups = [
  ["Class 9", "A", "Class 9 - Section A"],
  ["Class 9", "B", "Class 9 - Section B"],
  ["Class 10", "A", "Class 10 - Section A"],
  ["Class 10", "B", "Class 10 - Section B"],
  ["Class 11", "A", "Class 11 - Section A"],
  ["Class 11", "C", "Class 11 - Section C"],
  ["Class 12", "A", "Class 12 - Section A"],
  ["Class 12", "C", "Class 12 - Section C"],
];

const source = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const sourceSheet = source.worksheets.getItem("Syllabus_Template");
const sourceUsed = sourceSheet.getUsedRange();
const header = sourceSheet.getRange("A1:L1").values[0];
const allRows = sourceSheet.getRange(`A2:L${sourceUsed.rowCount}`).values;

const workbook = Workbook.create();
for (const [grade, section, sheetName] of groups) {
  const rows = allRows.filter((row) => row[1] === grade && row[2] === section);
  const sheet = workbook.worksheets.add(sheetName);
  const printHeader = [header[0], header[3], header[4], header[5], header[6], header[8], header[9], header[10], header[11]];
  sheet.showGridLines = false;
  sheet.mergeCells("A1:I1");
  sheet.getRange("A1").values = [[`${grade} — Section ${section}: Syllabus Cross-check Copy`]];
  sheet.getRange("A1:I1").format = {
    fill: "#1F4E78",
    font: { name: "Arial", size: 14, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  sheet.getRange("A1:L1").format.rowHeight = 26;
  sheet.mergeCells("A2:I2");
  sheet.getRange("A2").values = [["Class/section-wise review: each row contains one subject and one examination syllabus for cross-checking."]];
  sheet.getRange("A2:I2").format = {
    font: { name: "Arial", size: 10, italic: true, color: "#404040" },
    horizontalAlignment: "left",
    verticalAlignment: "center",
  };
  sheet.getRange("A2:L2").format.rowHeight = 20;
  sheet.getRange("A4:I4").values = [printHeader];
  sheet.getRange("A4:I4").format = {
    fill: "#244A9A",
    font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange("A4:L4").format.rowHeight = 30;
  if (rows.length) {
    const outputRows = rows.map((row, index) => [index + 1, row[3], row[4], row[5], row[6], row[8], row[9], row[10], row[11]]);
    sheet.getRange(`A5:I${rows.length + 4}`).values = outputRows;
    sheet.getRange(`A5:I${rows.length + 4}`).format.font = { name: "Arial", size: 10, color: "#1F1F1F" };
    sheet.getRange(`A5:I${rows.length + 4}`).format.wrapText = true;
    sheet.getRange(`A5:I${rows.length + 4}`).format.verticalAlignment = "top";
    sheet.getRange(`A4:I${rows.length + 4}`).format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
    sheet.getRange(`A5:I${rows.length + 4}`).format.autofitRows();
  }
  const widths = [7, 24, 13, 15, 26, 80, 55, 12, 16];
  for (let col = 0; col < widths.length; col += 1) {
    sheet.getRangeByIndexes(0, col, Math.max(rows.length + 4, 5), 1).format.columnWidth = widths[col];
  }
  sheet.freezePanes.freezeRows(4);
  sheet.freezePanes.freezeColumns(2);
}

workbook.recalculate();
await fs.mkdir("output", { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ output: outputPath, sheets: groups.length, counts: groups.map(([grade, section]) => ({ grade, section, rows: allRows.filter((row) => row[1] === grade && row[2] === section).length })) }));

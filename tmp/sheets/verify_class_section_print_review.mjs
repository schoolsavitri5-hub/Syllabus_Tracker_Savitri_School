import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load("../../output/Savitri_School_Syllabus_Class_Section_Print_Review.xlsx"));
const first = workbook.worksheets.getItem("Class 9 - Section A");
console.log((await workbook.inspect({ kind: "workbook,sheet,region", sheetId: first.id, range: "A1:L10", maxChars: 10000, tableMaxRows: 10, tableMaxCols: 12, tableMaxCellChars: 250 })).ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
console.log(errors.ndjson);
const image = await workbook.render({ sheetName: "Class 9 - Section A", range: "A1:L10", scale: 1, format: "png" });
await fs.writeFile("class_section_print_preview.png", new Uint8Array(await image.arrayBuffer()));

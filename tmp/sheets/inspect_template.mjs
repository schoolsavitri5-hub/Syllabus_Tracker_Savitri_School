import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("input/template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
console.log((await workbook.inspect({
  kind: "workbook,sheet,table,region,formula,definedName",
  maxChars: 15000,
  tableMaxRows: 20,
  tableMaxCols: 15,
  tableMaxCellChars: 200,
})).ndjson);
for (const sheetName of ["Syllabus"] ) {
  try {
    const image = await workbook.render({ sheetName, autoCrop: "all", scale: 1.5, format: "png" });
    await fs.writeFile(`tmp/sheets/${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
  } catch (error) { console.log(String(error)); }
}

import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const filePath = "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx";
const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hindiMonths = { April: "अप्रैल", May: "मई", June: "जून", July: "जुलाई", August: "अगस्त", September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर" };
const cache = new Map();

async function translate(text) {
  const source = text.trim();
  if (!source) return source;
  if (cache.has(source)) return cache.get(source);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: "hi", dt: "t", q: source }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation service returned ${response.status}`);
  const data = await response.json();
  const translated = (data?.[0] ?? []).map((part) => part?.[0] ?? "").join("").trim();
  if (!translated) throw new Error("Translation service returned blank text");
  cache.set(source, translated);
  return translated;
}

function parsePoint(paragraph) {
  const match = paragraph.match(/^\s*(\d+)\.\s*(?:.*?)\s\/\s(April|May|June|July|August|September|October|November|December):\s*([\s\S]*)$/i);
  return match ? { number: match[1], month: match[2], english: match[3].trim() } : null;
}

async function mapWithConcurrency(items, limit, worker) {
  const result = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      result[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return result;
}

const input = await FileBlob.load(filePath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
const used = sheet.getUsedRange();
const details = sheet.getRange(`I2:I${used.rowCount}`).values.map((row) => String(row[0] ?? ""));
const points = [];
for (const detail of details) {
  for (const paragraph of detail.split(/\n\s*\n/)) {
    const point = parsePoint(paragraph);
    if (point) points.push(point.english);
  }
}
const uniqueEnglish = [...new Set(points)];
await mapWithConcurrency(uniqueEnglish, 4, async (english) => translate(english));
const translatedDetails = details.map((detail) => detail.split(/\n\s*\n/).map((paragraph) => {
  const point = parsePoint(paragraph);
  if (!point) return paragraph;
  const hindi = cache.get(point.english);
  return `${point.number}. ${hindiMonths[point.month]}: ${hindi} / ${point.month}: ${point.english}`;
}).join("\n\n"));
sheet.getRange(`I2:I${used.rowCount}`).values = translatedDetails.map((detail) => [detail]);
sheet.getRange(`I2:I${used.rowCount}`).format.wrapText = true;
sheet.getRange(`I2:I${used.rowCount}`).format.verticalAlignment = "top";
sheet.getRange(`A2:L${used.rowCount}`).format.autofitRows();
workbook.recalculate();
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(filePath);
console.log(JSON.stringify({ rows: details.length, uniquePointsTranslated: uniqueEnglish.length, output: filePath }));

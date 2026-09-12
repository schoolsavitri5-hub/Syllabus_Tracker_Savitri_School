import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const monthly = JSON.parse(await fs.readFile("tmp/pdfs/monthly_source.json", "utf8"));
const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December"];
const assessments = [
  { name: "UT 1", term: "Apr - Jul", included: new Set(["April", "May", "June", "July"]) },
  { name: "UT 2", term: "Aug", included: new Set(["August"]) },
  { name: "Half Yearly", term: "Apr - Oct", included: new Set(["April", "May", "June", "July", "August", "September", "October"]) },
  { name: "UT 3", term: "Nov", included: new Set(["November"]) },
  { name: "UT 4", term: "Dec", included: new Set(["December"]) },
  { name: "Annual", term: "Apr - Dec", included: new Set(months) },
];

const sets = [
  ["Class 9", "A", "9-A.pdf", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-928 / MATHEMATICS", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 9", "B", "9-A.pdf", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-930 / HOME SCIENCE", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 10", "A", "10-A.pdf", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-928 / MATHEMATICS", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 10", "B", "10-A.pdf", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-930 / HOME SCIENCE", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 11", "A", "11-A.pdf", ["SUB-101 / HINDI", "SUB-117 / ENGLISH", "SUB-130 / CIVICS / POLITICAL SCIENCE", "SUB-134 / EDUCATION / SHIKSHA SHASTRA", "SUB-135 / HOME SCIENCE", "SUB-140 / FINE ARTS / DESIGN", "SUB-142 / SOCIOLOGY"]],
  ["Class 11", "C", "11-C.pdf", ["SUB-101 / HINDI", "SUB-117 / ENGLISH", "SUB-131 / MATHEMATICS", "SUB-151 / PHYSICS", "SUB-152 / CHEMISTRY", "SUB-153 / BIOLOGY"]],
  ["Class 12", "A", "12-A.pdf", ["SUB-102 / GENERAL HINDI", "SUB-117 / ENGLISH", "SUB-131 / MATHEMATICS", "SUB-151 / PHYSICS", "SUB-152 / CHEMISTRY", "SUB-153 / BIOLOGY"]],
  ["Class 12", "C", "12-A.pdf", ["SUB-102 / GENERAL HINDI", "SUB-117 / ENGLISH", "SUB-131 / MATHEMATICS", "SUB-151 / PHYSICS", "SUB-152 / CHEMISTRY", "SUB-153 / BIOLOGY"]],
];

const monthHindi = { April: "अप्रैल", May: "मई", June: "जून", July: "जुलाई", August: "अगस्त", September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर" };
const clean = (text) => String(text ?? "")
  .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
  .replace(/\b(?:In-?Prog\.?|Pending|Done|Progress|Exam\s*\/\s*Assessment|Subject Teacher.*|Principal.*)\b/gi, " ")
  .replace(/\s+/g, " ").replace(/\s*[,;—-]\s*$/, "").trim();

const c10HomeScience = {
  April: "Unit 1: Home Management — annual budget; income, expenditure and savings; post-office and bank services; home cleaning and decoration; household mathematics: decimals, addition, subtraction, multiplication and division.",
  May: "Unit 1 completed — percentage, profit and loss, simple interest. Unit 2: Water sources and uses; household methods of water purification.",
  June: "Unit 2: Water-borne diseases; environment and waste; causes and prevention of common diseases.",
  July: "Unit 2 completed — duties of a driver, traffic rules, helmet and seat belt.",
  August: "Unit 3: Textiles and Fabric — sewing kit; hand and machine sewing; washing, care and ironing of clothes.",
  September: "Unit 4: Food and Nutrition — kitchen arrangement and cleanliness; methods of cooking and serving food.",
  October: "Unit 4 completed — therapeutic diets; project work begins.",
  November: "Unit 5: First Aid and Home Care — skeleton, joints, fractures and respiratory system.",
  December: "Unit 5 completed — artificial respiration; patient transfer; compress, hot fomentation, steam, ice cap; pulse, respiration and temperature chart.",
};
const hsPractical = {
  April: "दैनिक सफाई रिकॉर्ड, फर्नीचर की सफाई/पॉलिश, धातु वस्तु की सफाई तथा वार्षिक बजट रिकॉर्ड / Daily cleaning record, furniture cleaning/polishing, cleaning a metal article and annual-budget record.",
  August: "सिलाई किट की पहचान; बेबी फ्रॉक/कुर्ता-पायजामा/पेटीकोट की सिलाई; सूती, रेशमी, ऊनी व कृत्रिम वस्त्रों की धुलाई / Identify sewing kit; sew baby frock/kurta-pyjama/petticoat; wash cotton, silk, woollen and synthetic clothes.",
  September: "उबालना, भाप देना, तलना, धीमी आँच पर पकाना व भूनना; भोजन परोसना / Boiling, steaming, frying, stewing, slow cooking and roasting; food serving.",
  October: "रोगी आहार: चावल का पानी, साबूदाना, खिचड़ी, सब्जी सूप/जूस, फल जूस व पन्ना / Patient diet: rice water, sago, khichdi, vegetable soup/juice, fruit juice and panna.",
  December: "कृत्रिम श्वसन, हाथ से रोगी स्थानांतरण, सेक/गरम पानी की थैली/भाप/आइस कैप तथा तापमान चार्ट / Artificial respiration, hand transfer of patient, compress/hot-water bag/steam/ice cap and temperature chart.",
};

function sourceFor(sourceFile, subject) {
  if (sourceFile === "10-A.pdf" && subject === "SUB-930 / HOME SCIENCE") return c10HomeScience;
  return monthly[sourceFile]?.[subject] ?? {};
}

function titleFor(month, assessment, topic) {
  const englishTopic = clean(topic).split(/[.;]/)[0].slice(0, 150);
  const suffix = assessment === "Half Yearly"
    ? " (संचयी) / (Cumulative)"
    : assessment === "Annual" ? " (संपूर्ण पाठ्यक्रम) / (Complete Course)" : "";
  return `${monthHindi[month]} का अध्याय/विषय${suffix}: / ${month} Chapter / Topic${suffix}: ${englishTopic}`;
}

const rows = [];
for (const [grade, section, sourceFile, subjects] of sets) {
  for (const subject of subjects) {
    const plan = sourceFor(sourceFile, subject);
    for (const assessment of assessments) {
      for (const month of months) {
        if (!assessment.included.has(month)) continue;
        const topic = clean(Array.isArray(plan[month]) ? plan[month].join(" ") : plan[month]);
        if (!topic) continue;
        const practical = subject === "SUB-930 / HOME SCIENCE" ? (hsPractical[month] ?? "") : "";
        const detailPrefix = assessment.name === "Half Yearly"
          ? `अर्धवार्षिक में सत्रारंभ से ${monthHindi[month]} तक यह संचयी रूप से शामिल है: / For Half Yearly, this is included cumulatively from the start of the session through ${month}:`
          : assessment.name === "Annual"
            ? `वार्षिक परीक्षा के संपूर्ण पाठ्यक्रम में शामिल विषय: / Included in the complete Annual syllabus:`
            : `${monthHindi[month]} के लिए पीडीएफ-अनुसार विषयवस्तु: / PDF-prescribed topic for ${month}:`;
        rows.push([grade, section, subject, assessment.term, assessment.name, titleFor(month, assessment.name, topic), `${detailPrefix} ${topic}`, practical]);
      }
    }
  }
}

const input = await FileBlob.load("input/template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
const lastRow = rows.length + 1;
sheet.getRange(`A2:L${lastRow}`).copyFrom(sheet.getRange("A2:L2"), "all");
sheet.getRange(`A2:L${lastRow}`).clear({ applyTo: "contents" });
sheet.getRange(`A2:L${lastRow}`).values = rows.map(([grade, section, subject, term, exam, title, detail, practical], index) => [
  index + 1, grade, section, subject, term, exam, title, title, detail, practical, "Not Done", ""
]);
sheet.getRange(`A2:L${lastRow}`).format.wrapText = true;
sheet.getRange(`A2:L${lastRow}`).format.verticalAlignment = "center";
sheet.getRange(`A1:L${lastRow}`).format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
sheet.getRange(`A2:L${lastRow}`).format.autofitRows();
sheet.freezePanes.freezeRows(1);
workbook.recalculate();
await fs.mkdir("output", { recursive: true });
const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save("output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx");
console.log(JSON.stringify({ rows: rows.length, output: "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx" }));

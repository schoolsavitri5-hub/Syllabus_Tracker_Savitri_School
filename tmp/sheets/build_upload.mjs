import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const terms = [
  ["Apr - July", "PA 1"],
  ["Aug - Oct", "Half Yearly"],
  ["Nov - Dec", "PA 2"],
  ["Jan - Feb", "Annual"],
];
const gradeOrder = ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
const subjectFormat = {
  Hindi: ["SUB-001", "HINDI"],
  Vyakaran: ["SUB-002", "VYAKARAN"],
  English: ["SUB-003", "ENGLISH"],
  Grammar: ["SUB-004", "GRAMMAR"],
  Rhymes: ["SUB-005", "RHYMES"],
  Math: ["SUB-006", "MATHEMATICS"],
  Science: ["SUB-007", "SCIENCE"],
  "Social Studies": ["SUB-008", "SOCIAL STUDIES"],
  Sanskrit: ["SUB-009", "SANSKRIT"],
  "A.R.T": ["SUB-010", "ART"],
  "E.V.S": ["SUB-011", "EVS"],
  "G.K": ["SUB-012", "GK"],
  Computer: ["SUB-013", "COMPUTER"],
  Activity: ["SUB-014", "ACTIVITY"],
};
const normalizeSubject = (subject) => clean(subject) === "Table Book" ? "Math" : clean(subject);
const classGroups = [
  ["Class 1", [1, 2]], ["Class 2", [3, 4]], ["Class 3", [5, 6]], ["Class 4", [7, 8, 9]],
  ["Class 5", [10, 11, 12]], ["Class 6", [13, 14, 15]], ["Class 7", [16, 17, 18]], ["Class 8", [19, 20, 21]],
];
const clean = (value) => String(value ?? "").replace(/\s+/g, " ").replace(/\s*•\s*/g, "; ").trim();
const sourceTables = JSON.parse(await fs.readFile("tmp/pdfs/tables.json", "utf8"));
const rows = [];

for (const [grade, pages] of classGroups) {
  const syllabus = new Map();
  let lastSubject = "";
  for (const pageNo of pages) {
    const page = sourceTables.find((item) => item.page === pageNo);
    for (const table of page.tables) {
      for (const rawRow of table) {
        const first = clean(rawRow[0]);
        if (["Our Examination", "Exam Schedule", "Exam Month"].includes(first) || !rawRow.some(Boolean)) continue;
        const candidates = rawRow.slice(1).filter((item) => clean(item));
        if (candidates.length < 1) continue;
        if (first) lastSubject = normalizeSubject(first.replace(/\n/g, " "));
        if (!lastSubject) continue;
        const values = candidates.slice(0, 4).map(clean);
        for (let index = 0; index < values.length; index += 1) {
          if (!values[index]) continue;
          const key = `${lastSubject}|${index}`;
          syllabus.set(key, [syllabus.get(key), values[index]].filter(Boolean).join("; "));
        }
      }
    }
  }
  for (const [key, detail] of syllabus) {
    const [subject, index] = key.split("|");
    const [month, assessment] = terms[Number(index)];
    rows.push([grade, subject, month, assessment, detail]);
  }
}

const addPrePrimary = (grade, subjects) => {
  for (const [subject, details] of Object.entries(subjects)) {
    details.forEach((detail, index) => rows.push([grade, subject, terms[index][0], terms[index][1], detail]));
  }
};

addPrePrimary("Nursery", {
  Hindi: ["Book work: Part 1 Hindi Activity Book, pages 6-33 (अ से क तक); Hindi Akshar Skills, pages 2-9; copy work: standing, sleeping, slanting and curve lines; letter and picture practice.", "Book work: Part 1 Hindi Activity Book, pages 34-64 (ख से अः तक); Hindi Akshar Skills, pages 10-20; revision and copy work.", "Book work: Part 2 Hindi Activity Book, pages 12-33 (अ से अः तक); Hindi Akshar Skills, pages 21-27; revision and copy work.", "Book work: Part 2 Hindi Activity Book, pages 34-64 (ख से अः तक); Hindi Akshar Skills, pages 28-40; copy work."],
  English: ["Book work: Part 1 English Activity Book, pages 14-43 (A-F); English Alphabet Skills, pages 2-9; line work, A-F, matching and colouring.", "Book work: Part 1 English Activity Book, pages 44-88 (G-L); English Alphabet Skills, pages 10-21; G-L, writing and matching.", "Book work: Part 2 English Activity Book, pages 6-41 (M-S); English Alphabet Skills, pages 22-32; M-S, revision and matching.", "Book work: Part 2 English Activity Book, pages 42-88 (T-Z); English Alphabet Skills, pages 33-48; ABCD song and copy work."],
  Math: ["Part 1 Maths Activity Book, pages 2-41; line work; counting 1-30; match, colour, before and circle shape.", "Part 1 Maths Activity Book, pages 42-80; counting 31-70; count and write; missing numbers; big/small, tall/short, more/less and shapes.", "Part 2 Maths Activity Book, pages 2-41; revision counting 1-70; count, write, match, missing numbers and triangle.", "Part 2 Maths Activity Book, pages 42-80; counting 1-100; count and write; missing numbers; before/after/between and all shapes."],
  Rhymes: ["English rhymes: Roses are red, Johny Johny, Rain on the grass, I have a little nose, Jack be nimble. Hindi rhymes as prescribed.", "English rhymes: Jingle Bells, Twinkle Twinkle Little Star, Brother John, Cobbler Cobbler, Two little dicky birds, After a bath. Hindi rhymes as prescribed.", "English rhymes: Bits of paper, I like to play, Baa Baa Black sheep, Dong-Dong Bell, Jack and Jill; story: The Lion and the Mouse. Hindi rhymes as prescribed.", "English rhymes: Row Row Row your boat, Hickory Dickory Dock, Cock-a-Doodle Doo, Lollipop, Traffic Light; story: The Lion and the Mouse. Hindi rhymes as prescribed."],
  "G.K": ["World of Knowledge chapters 1-7: All about me; Small Family; Joint Family; My Face & My Body; My house; Rooms in a House; Colours.", "World of Knowledge chapters 8-14: In the Classroom; Fruits; Vegetables; Food; Pet Animals; Domestic Animals; In the Farm.", "World of Knowledge chapters 15-20: Wild Animals; Birds; Flowers; Seasons; Vehicles; Toys.", "World of Knowledge chapters 21-25: Clothes; Festivals; Action Words; Magic Words; Keeping Clean."],
  "A.R.T": ["My Creative Art: Colours Chart, Cake, Gift, Watermelon, Ball, No. 1, No. 8 and Star (colouring).", "My Creative Art: Clouds, Book, Gingerbread, Ship, Rocket, Maze, Dinosaur and Mango.", "My Creative Art: Pear, House, Rat, Sea Voyage, Flower, Christmas Stocking, Ice Cream and Apple.", "My Creative Art: Tree, Camel, Elephant, Duck, Sparrow, Crocodile, Grapes and Garden."],
});

addPrePrimary("LKG", {
  Hindi: ["Part 1 Hindi Activity Book, pages 2-43; Hindi Akshar Skills, pages 3-9 and 48; revision अ से अः and क से ण; copy work.", "Part 1 Hindi Activity Book, pages 44-88; Hindi Akshar Skills, pages 10-21 and pages 41-43; revision त से क्ष; copy work.", "Part 2 Hindi Activity Book, pages 2-36; Hindi Akshar Skills, pages 22-30 and pages 44-46; revision and copy work.", "Part 2 Hindi Activity Book, pages 37-72; Hindi Akshar Skills, pages 32-40 and 47; copy work including picture writing and word practice."],
  English: ["Part 1 English Activity Book, pages 2-49 (a-z and cursive a-f); English Literacy Skills, pages 3-24; tracing, small letters, picture identification and matching.", "Part 1 English Activity Book, pages 50-96 (cursive g-z); English Literacy Skills, pages 25-45; cursive letters, correct letter and sound practice.", "Part 2 English Activity Book, pages 2-44; English Literacy Skills, pages 46-51; capital/small letters, three-letter words and use of A/An.", "Part 2 English Activity Book, pages 45-88; English Literacy Skills, pages 52-56; sound u, this/that, one/many, he/she and picture naming."],
  Math: ["Part 1 Maths Activity Book, pages 2-45; counting 1-30, count and match, missing numbers and shapes.", "Part 1 Maths Activity Book, pages 46-88; counting 51-100, missing numbers, biggest/smallest, comparison, reverse counting and tables from 2.", "Part 2 Maths Activity Book, pages 2-48; reverse counting, number names 6-10, greater/less/equal and copy work.", "Part 2 Maths Activity Book, pages 49-96; addition, subtraction, shapes, tables, time, days/months and Indian currency."],
  Rhymes: ["English rhymes: The Clock, Polite Words, I hear Thunder, Teddy Bear, I’m a little teapot; story: The clever fox and the goat. Hindi rhymes as prescribed.", "English rhymes: Humpty Dumpty, Hot Cross Buns, A baby, It’s Raining, Big Snowman. Hindi rhymes as prescribed.", "English rhymes: Pat-a-cake, The Incy Wincy spider, My red balloon, The ten eggs; story: The ant and the grasshopper. Hindi rhymes as prescribed.", "English rhymes: Honey, Little seed, The vegetables song, Happy naughty monkey. Hindi rhymes as prescribed."],
  "G.K": ["World of Knowledge chapters 1-8: All about Me, Colours, Body parts, Sense organs, Roll a task, Family, Bathroom, Living room.", "World of Knowledge chapters 9-17: Kitchen, Bedroom, Good Habits, Fruits and Vegetables Shop, Fruits, Vegetables, Food we eat, Flowers, Wild animals.", "World of Knowledge chapters 18-25: Domestic and pet animals, Animals and their babies, Water animals, Birds, Vehicles, Neighbourhood places, Community helpers, Traffic lights.", "World of Knowledge chapters 26-33: Day, Night, Seasons, Indoor games, Outdoor games, In the park, Festivals, Computer."],
  "A.R.T": ["My Creative Art: Geometrical Shapes, Maple leaf, Cactus, Worm, Bird, Whale, Starfish and Pencil.", "My Creative Art: Bag, Helmet, Football, Acorn, Mushroom, Cat, Dog and House.", "My Creative Art: Bat, Grapes, Ice Creams, Balloons, Hot Balloon, Crab, Fish and Bear.", "My Creative Art: Owl, Snail, Elephant, Deer, Sheep, Unicorn, Rabbit and Swan."],
});

addPrePrimary("UKG", {
  Hindi: ["Part 1 Hindi Activity Book, pages 2-39; Hindi Swar Skills, pages 3-21; revision and copy work for स्वर (अ-अः).", "Part 1 Hindi Activity Book, pages 40-80; Hindi Swar Skills, pages 22-30 and pages 55-56; मात्रा practice and copy work.", "Part 2 Hindi Activity Book, pages 2-39; Hindi Swar Skills, pages 31-39 and pages 53-54; मात्रा practice, names and copy work.", "Part 2 Hindi Activity Book, pages 40-80; Hindi Swar Skills, pages 40-52; copy work, two-letter words, counting and vocabulary practice."],
  English: ["Part 1 English Activity Book, pages 2-61; English Literacy Skills, pages 3-64; cursive capital/small letters, missing letters, matching and identification.", "Part 1 English Activity Book, pages 62-104; English Literacy Skills, pages 31-37 and 40-48; cursive words, word endings and picture-word matching.", "Part 2 English Activity Book, pages 2-54; English Literacy Skills, pages 10-30 and 38-50; vowels/consonants, A/An, singular/plural, s/es, this/that and he/she/it.", "Part 2 English Activity Book, pages 55-96; English Literacy Skills, pages 51-66; opposites, action words, use of and/has/have/in/on/under/near, names and sentences."],
  Math: ["Part 1 Maths Activity Book, pages 2-47; counting 1-200, number names 1-20, reverse counting, numeral matching and tables 2-3.", "Part 1 Maths Activity Book, pages 48-96; before/after/between, addition/subtraction, counting 201-300, number names, tables 4-6 and comparison.", "Part 2 Maths Activity Book, pages 2-49; counting 300-450, comparisons, top/bottom, more/less, reverse counting, 51-60 number names and addition/subtraction.", "Part 2 Maths Activity Book, pages 50-96; counting 451-500, tables 7-10, 3D shapes, ordinal numbers, order, 61-100 number names, multiplication, division, time, direction and Roman numbers."],
  Rhymes: ["English rhymes: Star Light, Star Bright; My School; Two Little Ducks; The Rainbow; Little Poll Parrot; story: The elephant and the tailor. Hindi rhymes as prescribed.", "English rhymes: Three Little Fish, The Night Sky, Mary Mary Quite Contrary, The muffin man, Aeroplane. Hindi rhymes as prescribed.", "English rhymes: Peter, Peter pumpkin eater; O giraffe, giraffe!; The big yellow bus; Ten little fingers; story: The Blue Jackal. Hindi rhymes as prescribed.", "English rhymes: Apples, Pussy cat, pussy cat, Little boy blue, The king of the jungle, Shoo shoo spider. Hindi rhymes as prescribed."],
  "G.K": ["World of Knowledge chapters 1-9, pages 3-13.", "World of Knowledge chapters 10-18, pages 14-31.", "World of Knowledge chapters 19-26, pages 32-45.", "World of Knowledge chapters 27-34, pages 46-56."],
  "A.R.T": ["My Creative Art, pages 1-8.", "My Creative Art, pages 9-16.", "My Creative Art, pages 17-24.", "My Creative Art, pages 25-32."],
  Activity: ["स्वर (अ-अः) पहचान; चित्र देखकर बोलना।", "स्वर (अ-अः) पहचान; कविताएँ (action के साथ); चित्र देखकर बोलना।", "स्वर (क से ज्ञ) पहचान; चित्र देखकर बोलना।", "स्वर (क से ज्ञ) पहचान; फल और सब्जियों के नाम चित्र देखकर पहचान।"],
});

rows.sort((a, b) => gradeOrder.indexOf(a[0]) - gradeOrder.indexOf(b[0]) || (subjectFormat[a[1]]?.[0] ?? "SUB-999").localeCompare(subjectFormat[b[1]]?.[0] ?? "SUB-999") || terms.findIndex((t) => t[0] === a[2]) - terms.findIndex((t) => t[0] === b[2]));

const input = await FileBlob.load("input/template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
const count = rows.length;
sheet.getRange(`A2:L${count + 1}`).copyFrom(sheet.getRange("A2:L2"), "all");
sheet.getRange(`A2:L${count + 1}`).clear({ applyTo: "contents" });
sheet.getRange(`A2:L${count + 1}`).values = rows.map(([grade, subject, month, assessment, detail], index) => [
  index + 1, grade, "A", `${subjectFormat[subject][0]} / ${subjectFormat[subject][1]}`, month, assessment, `${assessment} Syllabus`, "", detail,
  "", "Not Done", "",
]);
sheet.getRange(`A2:L${count + 1}`).format.wrapText = true;
sheet.getRange(`A2:L${count + 1}`).format.verticalAlignment = "center";
sheet.getRange(`A1:L${count + 1}`).format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
sheet.getRange(`A1:L${count + 1}`).format.autofitRows();
sheet.freezePanes.freezeRows(1);
workbook.recalculate();

await fs.mkdir("output", { recursive: true });
const out = await SpreadsheetFile.exportXlsx(workbook);
await out.save("output/Savitri_School_Syllabus_2026-27_ERP_Upload.xlsx");
console.log(JSON.stringify({ records: count, output: "output/Savitri_School_Syllabus_2026-27_ERP_Upload.xlsx" }));

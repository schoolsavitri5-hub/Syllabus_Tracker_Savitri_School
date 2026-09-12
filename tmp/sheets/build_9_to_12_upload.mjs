import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const terms = [
  ["Apr - July", "UT 1", "UT 1 syllabus"],
  ["Aug", "UT 2", "UT 2 syllabus"],
  ["Sep - Oct", "Half Yearly", "Half-Yearly syllabus"],
  ["Nov", "UT 3", "UT 3 syllabus"],
  ["Dec", "UT 4", "UT 4 syllabus"],
  ["Jan - Mar", "Annual", "Annual syllabus and revision"],
];
const subjectPlans = {
  "SUB-901 / HINDI": ["Prescribed prose, poetry, grammar and writing skills scheduled for April-July, including Unit Test 1 portion.", "Prescribed prose, poetry, grammar, Sanskrit and writing skills scheduled for Half-Yearly examination.", "Remaining prescribed prose, poetry, Sanskrit, grammar and writing skills scheduled for Unit Test 2.", "Complete prescribed Hindi syllabus, revision and annual examination preparation."],
  "SUB-102 / GENERAL HINDI": ["Hindi prose, grammar and writing skills scheduled for UT 1.", "Hindi poetry, Sanskrit section, grammar and writing skills scheduled for Half-Yearly examination.", "Remaining prescribed General Hindi portions and Unit Test 2 syllabus.", "Complete General Hindi syllabus, revision and annual examination preparation."],
  "SUB-117 / ENGLISH": ["Reading, writing skills, grammar and prescribed literature scheduled for UT 1.", "Reading, writing skills, grammar and prescribed literature scheduled for Half-Yearly examination.", "Remaining reading, writing skills, grammar and prescribed literature scheduled for UT 2.", "Complete English syllabus, revision and annual examination preparation."],
  "SUB-928 / MATHEMATICS": ["Number Systems and Algebra topics scheduled for UT 1.", "Algebra, Coordinate Geometry and Geometry topics scheduled for Half-Yearly examination.", "Mensuration and Statistics topics scheduled for UT 2.", "Complete prescribed Mathematics syllabus, revision and annual examination preparation."],
  "SUB-930 / HOME SCIENCE": ["Prescribed Home Science units and practical/theory topics scheduled for UT 1.", "Prescribed Home Science units and theory topics scheduled for Half-Yearly examination.", "Remaining prescribed Home Science units and theory topics scheduled for UT 2.", "Complete Home Science syllabus, revision and annual examination preparation."],
  "SUB-931 / SCIENCE": ["Prescribed Physics, Chemistry and Biology chapters scheduled for UT 1.", "Prescribed Physics, Chemistry and Biology chapters scheduled for Half-Yearly examination.", "Remaining prescribed Physics, Chemistry and Biology chapters scheduled for UT 2.", "Complete Science syllabus, revision and annual examination preparation."],
  "SUB-932 / SOCIAL SCIENCE": ["Prescribed History, Geography, Civics and Economics topics scheduled for UT 1.", "Prescribed History, Geography, Civics and Economics topics scheduled for Half-Yearly examination.", "Remaining prescribed History, Geography, Civics and Economics topics scheduled for UT 2.", "Complete Social Science syllabus, revision and annual examination preparation."],
  "SUB-936 / ART / DRAWING": ["Prescribed drawing, design and practical art work scheduled for UT 1.", "Prescribed drawing, design and practical art work scheduled for Half-Yearly examination.", "Remaining prescribed drawing, design and practical art work scheduled for UT 2.", "Complete Art / Drawing syllabus, revision and annual examination preparation."],
  "SUB-941 / COMPUTER": ["Prescribed computer theory and practical topics scheduled for UT 1.", "Prescribed computer theory and practical topics scheduled for Half-Yearly examination.", "Remaining prescribed computer theory and practical topics scheduled for UT 2.", "Complete Computer syllabus, revision and annual examination preparation."],
  "SUB-130 / CIVICS / POLITICAL SCIENCE": ["Prescribed Political Science units scheduled for UT 1.", "Prescribed Political Science units scheduled for Half-Yearly examination.", "Remaining prescribed Political Science units scheduled for UT 2.", "Complete Political Science syllabus, revision and annual examination preparation."],
  "SUB-134 / EDUCATION / SHIKSHA SHASTRA": ["Prescribed Education / Shiksha Shastra units scheduled for UT 1.", "Prescribed Education / Shiksha Shastra units scheduled for Half-Yearly examination.", "Remaining prescribed Education / Shiksha Shastra units scheduled for UT 2.", "Complete Education / Shiksha Shastra syllabus, revision and annual examination preparation."],
  "SUB-135 / HOME SCIENCE": ["Prescribed Home Science units scheduled for UT 1.", "Prescribed Home Science units scheduled for Half-Yearly examination.", "Remaining prescribed Home Science units scheduled for UT 2.", "Complete Home Science syllabus, revision and annual examination preparation."],
  "SUB-140 / FINE ARTS / DESIGN": ["Prescribed Fine Arts / Design units and practical work scheduled for UT 1.", "Prescribed Fine Arts / Design units and practical work scheduled for Half-Yearly examination.", "Remaining prescribed Fine Arts / Design units and practical work scheduled for UT 2.", "Complete Fine Arts / Design syllabus, revision and annual examination preparation."],
  "SUB-142 / SOCIOLOGY": ["Prescribed Sociology units scheduled for UT 1.", "Prescribed Sociology units scheduled for Half-Yearly examination.", "Remaining prescribed Sociology units scheduled for UT 2.", "Complete Sociology syllabus, revision and annual examination preparation."],
  "SUB-131 / MATHEMATICS": ["Prescribed Mathematics units scheduled for UT 1.", "Prescribed Mathematics units scheduled for Half-Yearly examination.", "Remaining prescribed Mathematics units scheduled for UT 2.", "Complete Mathematics syllabus, revision and annual examination preparation."],
  "SUB-151 / PHYSICS": ["Prescribed Physics units and numericals scheduled for UT 1.", "Prescribed Physics units and numericals scheduled for Half-Yearly examination.", "Remaining prescribed Physics units and numericals scheduled for UT 2.", "Complete Physics syllabus, revision and annual examination preparation."],
  "SUB-152 / CHEMISTRY": ["Prescribed Chemistry units and numericals scheduled for UT 1.", "Prescribed Chemistry units and numericals scheduled for Half-Yearly examination.", "Remaining prescribed Chemistry units and numericals scheduled for UT 2.", "Complete Chemistry syllabus, revision and annual examination preparation."],
  "SUB-153 / BIOLOGY": ["Prescribed Biology units and diagrams scheduled for UT 1.", "Prescribed Biology units and diagrams scheduled for Half-Yearly examination.", "Remaining prescribed Biology units and diagrams scheduled for UT 2.", "Complete Biology syllabus, revision and annual examination preparation."],
};

const bilingual = (english, hindi) => `${hindi} / ${english}`;
const curriculum = {
  "SUB-901 / HINDI": [
    ["गद्य खंड एवं पद्य खंड / Prose and Poetry", "Hindi prose lessons, poetry, grammar and writing practice for UT 1 / हिंदी गद्य-पद्य, व्याकरण एवं लेखन अभ्यास - UT 1"],
    ["गद्य, पद्य एवं संस्कृत खंड / Prose, Poetry and Sanskrit", "Prescribed prose, poetry, Sanskrit section, grammar and writing skills for Half-Yearly / अर्धवार्षिक हेतु निर्धारित गद्य, पद्य, संस्कृत, व्याकरण एवं लेखन"],
    ["शेष पाठ एवं व्याकरण / Remaining Lessons and Grammar", "Remaining literature, Sanskrit, grammar and writing skills for UT 2 / UT 2 हेतु शेष साहित्य, संस्कृत, व्याकरण एवं लेखन"],
    ["पूर्ण पाठ्यक्रम एवं पुनरावृत्ति / Full Syllabus and Revision", "Complete Hindi syllabus, revision and model-paper practice / संपूर्ण हिंदी पाठ्यक्रम, पुनरावृत्ति एवं मॉडल-पेपर अभ्यास"],
  ],
  "SUB-102 / GENERAL HINDI": [
    ["खंड-क: गद्य एवं व्याकरण / Section A: Prose and Grammar", "History of Hindi prose; prescribed prose lessons 1-6; grammar and writing practice / हिंदी गद्य का इतिहास; निर्धारित गद्य पाठ 1-6; व्याकरण एवं लेखन"],
    ["खंड-क: पद्य; खंड-ख: संस्कृत / Poetry and Sanskrit", "History of Hindi poetry, prescribed poets, Sanskrit lessons 1-7, essay and letter writing / हिंदी काव्य का इतिहास, निर्धारित कवि, संस्कृत पाठ 1-7, निबंध एवं पत्र लेखन"],
    ["खंड-क: खंडकाव्य; खंड-ख: पुनरावृत्ति / Khand Kavya and Revision", "Khand Kavya, complete language skills and model paper practice for UT 2 / खंडकाव्य, संपूर्ण भाषा-कौशल एवं UT 2 मॉडल पेपर अभ्यास"],
    ["संपूर्ण पाठ्यक्रम / Complete Syllabus", "Full General Hindi syllabus, comprehensive revision and annual examination preparation / संपूर्ण सामान्य हिंदी पाठ्यक्रम, गहन पुनरावृत्ति एवं वार्षिक परीक्षा तैयारी"],
  ],
  "SUB-117 / ENGLISH": [
    ["Reading, Writing and Literature - I / पठन, लेखन एवं साहित्य - I", "Reading comprehension, writing skills, grammar and first prescribed literature units / अपठित बोध, लेखन कौशल, व्याकरण एवं निर्धारित साहित्य की प्रारंभिक इकाइयाँ"],
    ["Literature and Grammar - II / साहित्य एवं व्याकरण - II", "Prescribed prose, poetry, supplementary reader, grammar and writing for Half-Yearly / अर्धवार्षिक हेतु निर्धारित गद्य, पद्य, पूरक पाठ्यपुस्तक, व्याकरण एवं लेखन"],
    ["Literature and Writing - III / साहित्य एवं लेखन - III", "Remaining literature, grammar, composition and revision for UT 2 / UT 2 हेतु शेष साहित्य, व्याकरण, रचना एवं पुनरावृत्ति"],
    ["Full Course Revision / पूर्ण पाठ्यक्रम पुनरावृत्ति", "Complete English course, practice papers and annual examination preparation / संपूर्ण अंग्रेज़ी पाठ्यक्रम, अभ्यास-पत्र एवं वार्षिक परीक्षा तैयारी"],
  ],
  "SUB-928 / MATHEMATICS": [
    ["Number Systems and Algebra / संख्या पद्धति एवं बीजगणित", "Unit 1: Number Systems; Unit 2: Polynomials and Algebra / इकाई 1: संख्या पद्धति; इकाई 2: बहुपद एवं बीजगणित"],
    ["Algebra, Coordinate Geometry and Geometry / बीजगणित, निर्देशांक ज्यामिति एवं ज्यामिति", "Linear equations in two variables, coordinate geometry, Euclid's geometry, lines and angles, triangles / दो चरों के रैखिक समीकरण, निर्देशांक ज्यामिति, यूक्लिडीय ज्यामिति, रेखाएँ एवं कोण, त्रिभुज"],
    ["Geometry, Mensuration and Statistics / ज्यामिति, क्षेत्रमिति एवं सांख्यिकी", "Quadrilaterals, circles, area, surface area, volume and statistics / चतुर्भुज, वृत्त, क्षेत्रफल, पृष्ठीय क्षेत्रफल, आयतन एवं सांख्यिकी"],
    ["Complete Mathematics Revision / संपूर्ण गणित पुनरावृत्ति", "Full prescribed Mathematics course, model questions and annual examination preparation / संपूर्ण निर्धारित गणित पाठ्यक्रम, मॉडल प्रश्न एवं वार्षिक परीक्षा तैयारी"],
  ],
  "SUB-930 / HOME SCIENCE": [
    ["Food, Nutrition and Family Resource Management / भोजन, पोषण एवं पारिवारिक संसाधन प्रबंधन", "Prescribed Home Science theory units and practical record work for UT 1 / गृह-विज्ञान की निर्धारित सैद्धांतिक इकाइयाँ एवं UT 1 प्रायोगिक रिकॉर्ड कार्य"],
    ["Health, Child Care and Textiles / स्वास्थ्य, बाल देखभाल एवं वस्त्र", "Prescribed theory units, case studies and practical work for Half-Yearly / अर्धवार्षिक हेतु निर्धारित इकाइयाँ, केस स्टडी एवं प्रायोगिक कार्य"],
    ["Home Management and Practical Work / गृह प्रबंधन एवं प्रायोगिक कार्य", "Remaining prescribed Home Science units, project work and viva preparation / शेष गृह-विज्ञान इकाइयाँ, परियोजना कार्य एवं मौखिकी तैयारी"],
    ["Full Home Science Course / संपूर्ण गृह-विज्ञान पाठ्यक्रम", "Complete syllabus, practical-file completion, revision and annual examination preparation / संपूर्ण पाठ्यक्रम, प्रायोगिक फाइल पूर्णता, पुनरावृत्ति एवं वार्षिक परीक्षा तैयारी"],
  ],
  "SUB-931 / SCIENCE": [
    ["Physics, Chemistry and Biology - I / भौतिकी, रसायन एवं जीवविज्ञान - I", "Initial prescribed chapters of Physics, Chemistry and Biology for UT 1 / UT 1 हेतु भौतिकी, रसायन एवं जीवविज्ञान के प्रारंभिक निर्धारित अध्याय"],
    ["Physics, Chemistry and Biology - II / भौतिकी, रसायन एवं जीवविज्ञान - II", "Prescribed mid-session chapters, numericals, diagrams and experiments for Half-Yearly / अर्धवार्षिक हेतु मध्य-सत्र अध्याय, संख्यात्मक, आरेख एवं प्रयोग"],
    ["Physics, Chemistry and Biology - III / भौतिकी, रसायन एवं जीवविज्ञान - III", "Remaining prescribed chapters, numericals, diagrams and experiments for UT 2 / UT 2 हेतु शेष अध्याय, संख्यात्मक, आरेख एवं प्रयोग"],
    ["Full Science Revision / संपूर्ण विज्ञान पुनरावृत्ति", "Complete Science syllabus, laboratory record, revision and annual examination preparation / संपूर्ण विज्ञान पाठ्यक्रम, प्रयोगशाला रिकॉर्ड, पुनरावृत्ति एवं वार्षिक परीक्षा तैयारी"],
  ],
  "SUB-932 / SOCIAL SCIENCE": [
    ["History, Geography, Civics and Economics - I / इतिहास, भूगोल, नागरिकशास्त्र एवं अर्थशास्त्र - I", "Initial prescribed units of History, Geography, Civics and Economics for UT 1 / UT 1 हेतु इतिहास, भूगोल, नागरिकशास्त्र एवं अर्थशास्त्र की प्रारंभिक इकाइयाँ"],
    ["Social Science - II / सामाजिक विज्ञान - II", "Prescribed mid-session History, Geography, Civics and Economics units for Half-Yearly / अर्धवार्षिक हेतु निर्धारित मध्य-सत्र इतिहास, भूगोल, नागरिकशास्त्र एवं अर्थशास्त्र इकाइयाँ"],
    ["Social Science - III / सामाजिक विज्ञान - III", "Remaining prescribed interdisciplinary units, map work and project work for UT 2 / UT 2 हेतु शेष इकाइयाँ, मानचित्र कार्य एवं परियोजना कार्य"],
    ["Full Social Science Revision / संपूर्ण सामाजिक विज्ञान पुनरावृत्ति", "Complete syllabus, map work, project revision and annual examination preparation / संपूर्ण पाठ्यक्रम, मानचित्र कार्य, परियोजना पुनरावृत्ति एवं वार्षिक परीक्षा तैयारी"],
  ],
};
const practicals = {
  "SUB-901 / HINDI": "Oral expression, creative writing and project file / मौखिक अभिव्यक्ति, सृजनात्मक लेखन एवं परियोजना फाइल",
  "SUB-102 / GENERAL HINDI": "Writing portfolio, oral expression and project file / लेखन पोर्टफोलियो, मौखिक अभिव्यक्ति एवं परियोजना फाइल",
  "SUB-117 / ENGLISH": "Speaking-listening, creative-writing portfolio and project work / श्रवण-बोलना, सृजनात्मक लेखन पोर्टफोलियो एवं परियोजना कार्य",
  "SUB-928 / MATHEMATICS": "Mathematics activity/project, practical record and oral assessment / गणित गतिविधि/परियोजना, प्रायोगिक रिकॉर्ड एवं मौखिक मूल्यांकन",
  "SUB-930 / HOME SCIENCE": "Food preparation, nutrition chart, household survey and practical file / भोजन निर्माण, पोषण चार्ट, गृह-सर्वेक्षण एवं प्रायोगिक फाइल",
  "SUB-931 / SCIENCE": "Physics, Chemistry and Biology experiments; labelled diagrams and laboratory record / भौतिकी, रसायन एवं जीवविज्ञान प्रयोग; नामांकित आरेख एवं प्रयोगशाला रिकॉर्ड",
  "SUB-936 / ART / DRAWING": "Drawing, composition, colouring, design and practical art portfolio / चित्रांकन, संयोजन, रंग-कार्य, डिज़ाइन एवं प्रायोगिक कला पोर्टफोलियो",
  "SUB-941 / COMPUTER": "Computer practicals, file work, programming/application practice and project / कंप्यूटर प्रायोगिक, फाइल कार्य, प्रोग्रामिंग/एप्लिकेशन अभ्यास एवं परियोजना",
  "SUB-135 / HOME SCIENCE": "Food and nutrition practicals, textile work, record file and project / भोजन एवं पोषण प्रयोग, वस्त्र कार्य, रिकॉर्ड फाइल एवं परियोजना",
  "SUB-140 / FINE ARTS / DESIGN": "Drawing/design practicals, portfolio and project work / चित्रांकन-डिज़ाइन प्रायोगिक, पोर्टफोलियो एवं परियोजना कार्य",
  "SUB-151 / PHYSICS": "Prescribed experiments, activities, graph work and laboratory record / निर्धारित प्रयोग, गतिविधियाँ, ग्राफ कार्य एवं प्रयोगशाला रिकॉर्ड",
  "SUB-152 / CHEMISTRY": "Prescribed experiments, chemical observations and laboratory record / निर्धारित प्रयोग, रासायनिक प्रेक्षण एवं प्रयोगशाला रिकॉर्ड",
  "SUB-153 / BIOLOGY": "Specimen study, slide work, labelled diagrams and practical record / नमूना अध्ययन, स्लाइड कार्य, नामांकित आरेख एवं प्रायोगिक रिकॉर्ड",
};
const splitTitle = (chapter) => {
  const parts = chapter.split(" / ");
  const hasHindi = (text) => /[\u0900-\u097F]/.test(text);
  const hindi = parts.find(hasHindi) ?? chapter;
  const english = parts.find((part) => !hasHindi(part)) ?? chapter;
  return [english, hindi];
};
const hindiFirst = (text) => {
  const parts = String(text).split(" / ").map((part) => part.trim()).filter(Boolean);
  const hindi = parts.filter((part) => /[\u0900-\u097F]/.test(part));
  const english = parts.filter((part) => !/[\u0900-\u097F]/.test(part));
  if (!hindi.length || !english.length) return text;
  return `${hindi.join("; ")} / ${english.join("; ")}`;
};
const fallback = (subject, index) => {
  const short = subject.replace(/^SUB-\d+ \/ /, "");
  const labels = ["Unit I / इकाई I", "Unit II / इकाई II", "Half-Yearly Course / अर्धवार्षिक पाठ्यक्रम", "Unit III / इकाई III", "Unit IV / इकाई IV", "Full Course Revision / पूर्ण पाठ्यक्रम पुनरावृत्ति"];
  return [labels[index], bilingual(`Prescribed ${short} topics for ${terms[index][1]}.`, `${terms[index][1]} हेतु निर्धारित ${short} विषयवस्तु।`)];
};
for (const [subject, units] of Object.entries({
  "SUB-130 / CIVICS / POLITICAL SCIENCE": ["Political Theory and Constitution / राजनीतिक सिद्धांत एवं संविधान", "Rights, Citizenship and Political Institutions / अधिकार, नागरिकता एवं राजनीतिक संस्थाएँ", "Remaining Political Science Units / शेष राजनीति विज्ञान इकाइयाँ", "Full Political Science Revision / संपूर्ण राजनीति विज्ञान पुनरावृत्ति"],
  "SUB-134 / EDUCATION / SHIKSHA SHASTRA": ["Foundations of Education / शिक्षा के आधार", "Educational Psychology and Learning / शैक्षिक मनोविज्ञान एवं अधिगम", "Remaining Education Units / शेष शिक्षा शास्त्र इकाइयाँ", "Full Education Revision / संपूर्ण शिक्षा शास्त्र पुनरावृत्ति"],
  "SUB-135 / HOME SCIENCE": ["Food, Nutrition and Health / भोजन, पोषण एवं स्वास्थ्य", "Human Development and Resource Management / मानव विकास एवं संसाधन प्रबंधन", "Textiles, Family Studies and Project / वस्त्र, परिवार अध्ययन एवं परियोजना", "Full Home Science Revision / संपूर्ण गृह-विज्ञान पुनरावृत्ति"],
  "SUB-140 / FINE ARTS / DESIGN": ["Fundamentals of Art and Design / कला एवं डिज़ाइन के मूल तत्व", "Drawing, Composition and Colour Study / चित्रांकन, संयोजन एवं रंग अध्ययन", "Applied Design and Portfolio / अनुप्रयुक्त डिज़ाइन एवं पोर्टफोलियो", "Full Fine Arts Revision / संपूर्ण ललित कला पुनरावृत्ति"],
  "SUB-142 / SOCIOLOGY": ["Introducing Society and Social Institutions / समाज एवं सामाजिक संस्थाओं का परिचय", "Social Change and Social Processes / सामाजिक परिवर्तन एवं सामाजिक प्रक्रियाएँ", "Indian Society and Contemporary Issues / भारतीय समाज एवं समकालीन मुद्दे", "Full Sociology Revision / संपूर्ण समाजशास्त्र पुनरावृत्ति"],
  "SUB-131 / MATHEMATICS": ["Algebra and Functions / बीजगणित एवं फलन", "Calculus and Coordinate Geometry / कलन एवं निर्देशांक ज्यामिति", "Vectors, Probability and Applied Mathematics / सदिश, प्रायिकता एवं अनुप्रयुक्त गणित", "Full Mathematics Revision / संपूर्ण गणित पुनरावृत्ति"],
  "SUB-151 / PHYSICS": ["Mechanics and Properties of Matter / यांत्रिकी एवं द्रव्य के गुण", "Thermal Physics, Oscillations and Waves / ऊष्मा भौतिकी, दोलन एवं तरंगें", "Electrostatics, Current Electricity and Magnetism / स्थिरवैद्युत, धारा विद्युत एवं चुंबकत्व", "Full Physics Revision / संपूर्ण भौतिकी पुनरावृत्ति"],
  "SUB-152 / CHEMISTRY": ["Physical Chemistry and Atomic Structure / भौतिक रसायन एवं परमाणु संरचना", "Chemical Bonding, Organic and Inorganic Chemistry / रासायनिक बंधन, कार्बनिक एवं अकार्बनिक रसायन", "Electrochemistry, Kinetics and Biomolecules / विद्युत रसायन, रासायनिक गतिकी एवं जैव-अणु", "Full Chemistry Revision / संपूर्ण रसायन पुनरावृत्ति"],
  "SUB-153 / BIOLOGY": ["Cell Biology and Plant Physiology / कोशिका जीवविज्ञान एवं पादप शरीर क्रिया", "Human Physiology and Genetics / मानव शरीर क्रिया एवं आनुवंशिकी", "Biotechnology, Ecology and Environment / जैव प्रौद्योगिकी, पारिस्थितिकी एवं पर्यावरण", "Full Biology Revision / संपूर्ण जीवविज्ञान पुनरावृत्ति"],
})) {
  curriculum[subject] = units.map((title, index) => [title, bilingual(`Prescribed ${subject.replace(/^SUB-\d+ \/ /, "")} syllabus for ${terms[index][1]}.`, `${terms[index][1]} हेतु निर्धारित ${subject.replace(/^SUB-\d+ \/ /, "")} पाठ्यक्रम।`)]);
}

const classSections = [
  ["Class 9", "A", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-928 / MATHEMATICS", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 9", "B", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-930 / HOME SCIENCE", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 10", "A", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-928 / MATHEMATICS", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 10", "B", ["SUB-901 / HINDI", "SUB-117 / ENGLISH", "SUB-930 / HOME SCIENCE", "SUB-931 / SCIENCE", "SUB-932 / SOCIAL SCIENCE", "SUB-936 / ART / DRAWING", "SUB-941 / COMPUTER"]],
  ["Class 11", "A", ["SUB-101 / HINDI", "SUB-117 / ENGLISH", "SUB-130 / CIVICS / POLITICAL SCIENCE", "SUB-134 / EDUCATION / SHIKSHA SHASTRA", "SUB-135 / HOME SCIENCE", "SUB-140 / FINE ARTS / DESIGN", "SUB-142 / SOCIOLOGY"]],
  ["Class 11", "C", ["SUB-101 / HINDI", "SUB-117 / ENGLISH", "SUB-131 / MATHEMATICS", "SUB-151 / PHYSICS", "SUB-152 / CHEMISTRY", "SUB-153 / BIOLOGY"]],
  ["Class 12", "A", ["SUB-102 / GENERAL HINDI", "SUB-117 / ENGLISH", "SUB-131 / MATHEMATICS", "SUB-151 / PHYSICS", "SUB-152 / CHEMISTRY", "SUB-153 / BIOLOGY"]],
  ["Class 12", "C", ["SUB-102 / GENERAL HINDI", "SUB-117 / ENGLISH", "SUB-131 / MATHEMATICS", "SUB-151 / PHYSICS", "SUB-152 / CHEMISTRY", "SUB-153 / BIOLOGY"]],
];
subjectPlans["SUB-101 / HINDI"] = subjectPlans["SUB-901 / HINDI"];

const rows = [];
for (const [grade, section, subjects] of classSections) {
  for (const subject of subjects) {
    terms.forEach(([month, assessment], index) => {
      const curriculumIndex = [0, 1, 1, 2, 2, 3][index];
      const source = curriculum[subject];
      let [chapter, detail] = source?.[curriculumIndex] ?? fallback(subject, index);
      if (assessment === "Half Yearly") {
        const [ut1Chapter, ut1Detail] = source?.[0] ?? fallback(subject, 0);
        const [ut2Chapter, ut2Detail] = source?.[1] ?? fallback(subject, 1);
        chapter = `Cumulative: ${ut1Chapter} + ${ut2Chapter}`;
        detail = "सत्रारंभ से अर्धवार्षिक तक का संचयी पाठ्यक्रम: UT-1 और UT-2 में निर्धारित सभी अध्याय, विषय, लेखन/व्यावहारिक कार्य। / Cumulative Half-Yearly syllabus from the start of the session: all chapters, topics, writing/practical work prescribed in UT-1 and UT-2.";
      }
      rows.push([grade, section, subject, month, assessment, chapter, detail, practicals[subject] ?? ""]);
    });
  }
}

const input = await FileBlob.load("input/template.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Syllabus_Template");
sheet.getRange(`A2:L${rows.length + 1}`).copyFrom(sheet.getRange("A2:L2"), "all");
sheet.getRange(`A2:L${rows.length + 1}`).clear({ applyTo: "contents" });
sheet.getRange(`A2:L${rows.length + 1}`).values = rows.map(([grade, section, subject, month, assessment, chapter, detail, practical], index) => {
  const [englishTitle, hindiTitle] = splitTitle(chapter);
  const adjustedDetail = detail
    .replaceAll("UT 2", assessment)
    .replaceAll("Half-Yearly", assessment)
    .replaceAll("अर्धवार्षिक", assessment === "UT 2" ? "UT-2" : "अर्धवार्षिक");
  return [index + 1, grade, section, subject, month, assessment, englishTitle, hindiTitle, hindiFirst(adjustedDetail), hindiFirst(practical), "Not Done", ""];
});
sheet.getRange(`A2:L${rows.length + 1}`).format.wrapText = true;
sheet.getRange(`A2:L${rows.length + 1}`).format.verticalAlignment = "center";
sheet.getRange(`A1:L${rows.length + 1}`).format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
sheet.getRange(`A2:L${rows.length + 1}`).format.autofitRows();
sheet.freezePanes.freezeRows(1);
workbook.recalculate();
await fs.mkdir("output", { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save("output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx");
console.log(JSON.stringify({ records: rows.length, output: "output/Savitri_School_Syllabus_Classes_9_to_12_ERP_Upload.xlsx" }));

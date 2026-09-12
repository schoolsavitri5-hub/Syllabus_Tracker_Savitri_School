from pathlib import Path
from pypdf import PdfReader
import json, re

specs = {
  "9-A.pdf": [(1,"SUB-901 / HINDI"),(7,"SUB-117 / ENGLISH"),(12,"SUB-928 / MATHEMATICS"),(18,"SUB-930 / HOME SCIENCE"),(23,"SUB-931 / SCIENCE"),(30,"SUB-932 / SOCIAL SCIENCE"),(37,"SUB-936 / ART / DRAWING"),(41,"SUB-941 / COMPUTER")],
  "10-A.pdf": [(1,"SUB-901 / HINDI"),(6,"SUB-117 / ENGLISH"),(11,"SUB-928 / MATHEMATICS"),(27,"SUB-931 / SCIENCE"),(34,"SUB-932 / SOCIAL SCIENCE"),(41,"SUB-936 / ART / DRAWING"),(46,"SUB-941 / COMPUTER")],
  "11-A.pdf": [(1,"SUB-101 / HINDI"),(9,"SUB-117 / ENGLISH"),(14,"SUB-130 / CIVICS / POLITICAL SCIENCE"),(19,"SUB-134 / EDUCATION / SHIKSHA SHASTRA"),(23,"SUB-135 / HOME SCIENCE"),(27,"SUB-140 / FINE ARTS / DESIGN"),(32,"SUB-142 / SOCIOLOGY")],
  "11-C.pdf": [(1,"SUB-101 / HINDI"),(7,"SUB-117 / ENGLISH"),(12,"SUB-131 / MATHEMATICS"),(21,"SUB-151 / PHYSICS"),(33,"SUB-152 / CHEMISTRY"),(45,"SUB-153 / BIOLOGY")],
  "12-A.pdf": [(1,"SUB-102 / GENERAL HINDI"),(13,"SUB-117 / ENGLISH"),(19,"SUB-131 / MATHEMATICS"),(30,"SUB-151 / PHYSICS"),(42,"SUB-152 / CHEMISTRY"),(53,"SUB-153 / BIOLOGY")],
}
month_names = ["April","May","June","July","August","September","October","November","December","January","February","March"]
month_rx = re.compile(r"\b(" + "|".join(month_names) + r")\b\s*(.*)", re.I)
skip_rx = re.compile(r"^(SAVITRI|Khutaha|Confidential|Page |Month$|Syllabus to be Taught|Assessment$|Done$|In-Progress|Pending|Annual Syllabus|Unit-wise|No\.|Description$|Grand Total|Session)", re.I)
assessment_rx = re.compile(r"(Unit Test|Half-Yearly|Pre-Board|Annual \(Board\)|Internal Assessment|marks|Examination)", re.I)

def mostly_ascii(text):
  useful = [c for c in text if not c.isspace()]
  if not useful: return False
  return sum(ord(c) < 128 for c in useful) / len(useful) >= 0.94 and sum(c.isalpha() for c in text) >= 3

def add_line(storage, month, line):
  line = re.sub(r"\s+", " ", line).strip()
  if not line or skip_rx.search(line) or assessment_rx.search(line): return
  if len(line) < 4: return
  if line not in storage[month]: storage[month].append(line)

out = {}
for filename, starts in specs.items():
  reader = PdfReader(str(Path("input/secondary") / filename))
  starts = starts + [(len(reader.pages)+1, "END")]
  out[filename] = {}
  for (start, subject), (end, _) in zip(starts, starts[1:]):
    records = {m: [] for m in month_names}
    active = None
    # The plan begins immediately after the subject cover and can occupy three pages.
    for page_no in range(start+1, min(start+5, end)):
      text = reader.pages[page_no-1].extract_text() or ""
      for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw).strip()
        # In the bilingual PDF, the English month is often on the same line as
        # Hindi text and the first English topic.
        found = month_rx.search(line)
        if found:
          active = found.group(1).capitalize()
          remainder = found.group(2).strip(" -–—:|")
          if mostly_ascii(remainder): add_line(records, active, remainder)
          continue
        # A new numbered unit-wise table follows the month plan.  Do not fold
        # its chapter list into March's plan.
        if active and ("Syllabus Description" in line or re.match(r"^(?:7|8)\.\d*\s", line)):
          active = None
          break
        if active and mostly_ascii(line): add_line(records, active, line)
    out[filename][subject] = {month: values for month, values in records.items() if values}
Path("tmp/pdfs/monthly_source.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
for filename, subjects in out.items():
  print("\n", filename)
  for subject, months in subjects.items():
    print(subject, {m: " ".join(v)[:120] for m,v in months.items()})

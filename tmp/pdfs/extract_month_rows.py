from pathlib import Path
import json
import re
import pdfplumber

months = re.compile(r"\b(April|May|June|July|August|September|October|November|December|January|February|March|Apr|Aug|Sept|Oct|Nov|Dec|Jan|Feb)\b", re.I)
result = {}
for path in sorted(Path("input/secondary").glob("*.pdf")):
    entries = []
    with pdfplumber.open(path) as pdf:
        for page_no, page in enumerate(pdf.pages, start=1):
            for table in page.extract_tables({"vertical_strategy": "lines", "horizontal_strategy": "lines", "intersection_tolerance": 5}) or []:
                for row in table:
                    cell = " | ".join((item or "").replace("\n", " ") for item in row)
                    if months.search(cell):
                        entries.append({"page": page_no, "row": cell})
    result[path.name] = entries
Path("tmp/pdfs/month_rows.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf8")
for name, entries in result.items():
    print(name, len(entries))
    for entry in entries[:16]: print(entry["page"], entry["row"][:600])

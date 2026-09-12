from pathlib import Path
import json
import pdfplumber

source = "input/classes_1_to_8.pdf"
all_pages = []
with pdfplumber.open(source) as pdf:
    for no, page in enumerate(pdf.pages, start=1):
        tables = page.extract_tables({"vertical_strategy": "lines", "horizontal_strategy": "lines", "intersection_tolerance": 5})
        all_pages.append({"page": no, "tables": tables})
Path("tmp/pdfs/tables.json").write_text(json.dumps(all_pages, ensure_ascii=False, indent=2), encoding="utf-8")
for page in all_pages:
    print("PAGE", page["page"], "TABLES", len(page["tables"]))
    for table in page["tables"]:
        for row in table[:5]: print(row)

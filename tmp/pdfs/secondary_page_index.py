from pathlib import Path
from pypdf import PdfReader

for path in sorted(Path("input/secondary").glob("*.pdf")):
    print(f"\n--- {path.name} ---")
    for i, page in enumerate(PdfReader(str(path)).pages, start=1):
        text = (page.extract_text() or "").replace("\n", " ")
        if "Annual Syllabus" in text or "Syllabus Distribution" in text:
            print(i, text[:180])

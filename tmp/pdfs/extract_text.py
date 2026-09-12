from pathlib import Path
from pypdf import PdfReader

for pdf in sorted(Path("input").glob("*.pdf")):
    reader = PdfReader(str(pdf))
    output = []
    for page_no, page in enumerate(reader.pages, start=1):
        output.append(f"\n\n===== PAGE {page_no} =====\n")
        output.append(page.extract_text(extraction_mode="layout") or "")
    Path("tmp/pdfs", f"{pdf.stem}.txt").write_text("".join(output), encoding="utf-8")

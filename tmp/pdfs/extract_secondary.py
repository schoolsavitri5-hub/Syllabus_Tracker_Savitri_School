from pathlib import Path
from pypdf import PdfReader

for path in sorted(Path("input/secondary").glob("*.pdf")):
    reader = PdfReader(str(path))
    blocks = []
    for number, page in enumerate(reader.pages, start=1):
        text = page.extract_text(extraction_mode="layout") or ""
        blocks.append(f"\n===== PAGE {number} =====\n{text}\n")
    Path("tmp/pdfs", f"{path.stem}.txt").write_text("".join(blocks), encoding="utf-8")

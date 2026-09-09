from pathlib import Path
import re
import pdfplumber
from docx import Document

ROOT = Path(__file__).resolve().parents[1]
PDF = Path('/Users/akashyadav/Downloads/Syllabus class 1 to 8 (1).pdf')
DOCX = Path('/Users/akashyadav/Downloads/Syllabus For Class Nursery to U.K.G..docx')
OUT = ROOT / 'supabase' / 'official-syllabus-2026-27.sql'
TERMS = [('PA 1', 'Apr - July'), ('Half Yearly', 'Aug - Oct'), ('PA 2', 'Nov - Dec'), ('Annual', 'Jan - Feb')]

def clean(value):
    return re.sub(r'\n{3,}', '\n\n', (value or '').replace('\r', '').strip())

def add_row(rows, class_name, subject, cells):
    subject = clean(subject)
    if not subject:
        return
    for index, (assessment, month) in enumerate(TERMS):
        content = clean(cells[index] if index < len(cells) else '')
        if content:
            rows.append((class_name, subject, assessment, month, content))

def pdf_rows():
    rows, current_class, previous_subject = [], None, None
    with pdfplumber.open(PDF) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ''
            match = re.search(r'CLASS\s+([IVX]+)(?:ST|ND|RD|TH)?', text, re.I)
            if match:
                roman = match.group(1).upper()
                current_class = {'I':'Class 1','II':'Class 2','III':'Class 3','IV':'Class 4','V':'Class 5','VI':'Class 6','VII':'Class 7','VIII':'Class 8'}.get(roman)
                previous_subject = None
            if not current_class:
                continue
            tables = page.extract_tables()
            if not tables:
                continue
            for row in tables[0]:
                if len(row) < 5 or clean(row[0]) in ('Our Examination', 'Exam\nSchedule', 'Exam\nMonth'):
                    continue
                subject = clean(row[0])
                cells = row[1:5]
                if subject:
                    previous_subject = subject
                    add_row(rows, current_class, subject, cells)
                elif previous_subject and any(clean(x) for x in cells):
                    # A table may continue a subject on the next page. Merge that period text.
                    for assessment, month, content in [(TERMS[i][0], TERMS[i][1], clean(cells[i])) for i in range(4) if clean(cells[i])]:
                        for pos in range(len(rows) - 1, -1, -1):
                            if rows[pos][:4] == (current_class, previous_subject, assessment, month):
                                rows[pos] = (*rows[pos][:4], rows[pos][4] + '\n' + content)
                                break
    return rows

def docx_rows():
    rows = []
    document = Document(DOCX)
    for class_name, table in zip(('Nursery', 'LKG', 'UKG'), document.tables[:3]):
        for row in table.rows[3:]:
            cells = [clean(cell.text) for cell in row.cells]
            if len(cells) >= 5:
                add_row(rows, class_name, cells[0], cells[1:5])
    return rows

def quote(value):
    return "'" + value.replace("'", "''") + "'"

records = docx_rows() + pdf_rows()
deduped = list(dict.fromkeys(records))
classes = ['Nursery', 'LKG', 'UKG'] + [f'Class {n}' for n in range(1, 9)]
subjects = sorted({record[1] for record in deduped})
lines = [
    '-- Generated from the approved 2026-27 Nursery-UKG DOCX and Class 1-8 PDF.',
    '-- This replaces syllabus topics only for Nursery through Class 8.',
    'begin;',
    "insert into public.classes (class_name, class_group) values " + ', '.join(f"({quote(name)}, 'PRIMARY')" for name in classes) + ' on conflict (class_name) do update set class_group = excluded.class_group;',
    "insert into public.subjects (subject_name) values " + ', '.join(f'({quote(name)})' for name in subjects) + ' on conflict (subject_name) do nothing;',
    "delete from public.syllabus_topics where class_id in (select id from public.classes where class_name in (" + ', '.join(quote(name) for name in classes) + '));',
]
for class_name, subject, assessment, month, content in deduped:
    lines.append("insert into public.syllabus_topics (class_id, subject_id, month, unit_chapter_en, topic_en, assessment_en, status) select c.id, s.id, %s, %s, %s, %s, 'Not Done'::public.topic_status from public.classes c cross join public.subjects s where c.class_name=%s and s.subject_name=%s;" % (quote(month), quote(f'{assessment} syllabus'), quote(content), quote(assessment), quote(class_name), quote(subject)))
lines.extend(['commit;', f'-- Imported {len(deduped)} class-subject-assessment records.'])
OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'Wrote {OUT} with {len(deduped)} records.')

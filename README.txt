KJSEA Digital Interactive Papers Patch

Add:
- lib/kjseaDigitalPapers.ts
- components/KjseaDigitalPaper.tsx
- components/KjseaDigitalPaper.module.css
- app/kjsea/[paper]/digital/page.tsx

Each paper has:
- Section A: 30 digital MCQs, 30 seconds each, automatic missed status and auto-advance
- Section B: 10 structured digital answer spaces, 4 marks each
- Teacher marking scheme with four marking points per question

Digital routes:
- /kjsea/2025-agriculture-nutrition/digital
- /kjsea/2025-integrated-science-paper-1/digital

To add a Digital Interactive Paper button on the current paper viewer page, link to `/kjsea/${p.id}/digital`.

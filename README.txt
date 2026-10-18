KJSEA Digital Paper Display Fix

Replace:
- components/KjseaBank.tsx
- app/kjsea/[paper]/page.tsx

The KJSEA bank cards now open /digital directly. Any old paper URL also redirects automatically to its digital version.

Required existing files from the digital paper package:
- lib/kjseaDigitalPapers.ts
- components/KjseaDigitalPaper.tsx
- components/KjseaDigitalPaper.module.css
- app/kjsea/[paper]/digital/page.tsx

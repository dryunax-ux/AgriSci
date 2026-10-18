Hamburger Menu Patch

This corrects the navigation design requested by the teacher.

Add:
- components/HamburgerMenu.tsx
- components/HamburgerMenu.module.css
- app/notes/page.tsx

Replace:
- app/layout.tsx

The top bar will show the JA logo, course name and a three-horizontal-line hamburger button. The old visible Home and Question Banks links are removed from the top bar and placed inside a right-side drawer.

The drawer contains:
- Home
- Lesson Notes
- Question Banks
- Grade 8 Agriculture
- Grade 8 Integrated Science
- Grade 9 Agriculture
- Grade 9 Integrated Science
- Strand Assessment
- Presentation Notes

Keep the Phase 10 /questions page and question-bank files already uploaded.
If needed, append the CSS from GLOBAL_CSS_ADDITION.txt to app/globals.css.

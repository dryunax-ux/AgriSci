Separate Lesson Notes Library Patch

This does NOT place notes inside the interactive lesson tabs.

Add:
- lib/lessonNotes.ts
- components/LessonNotesMenu.tsx
- components/LessonNotesMenu.module.css
- app/notes/page.tsx
- app/notes/[grade]/[subject]/[substrand]/[lesson]/page.tsx

The existing hamburger menu already links to /notes.

The library imports phase2.ts through phase8.ts, so all those files must remain in lib/. It creates 540 separate note routes and filtering by grade, learning area, strand, sub-strand and lesson.

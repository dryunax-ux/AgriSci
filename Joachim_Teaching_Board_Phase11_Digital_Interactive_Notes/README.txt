Phase 11 Digital Interactive Notes Integration

Add:
- lib/digitalNoteEngine.ts
- components/DigitalLessonNotes.tsx
- components/DigitalLessonNotes.module.css

Replace:
- components/InteractiveActivity.tsx

Every detailed lesson already uses InteractiveActivity. Therefore all 540 lesson routes gain:
- Digital tabbed lesson notes
- Key idea reveal/hide
- Vocabulary chips
- Process sequencing
- Safety and responsible-practice notes
- Misconception correction cards
- Five-point summary
- Oral-review prompts
- Printable note view
- Existing interactive figure/diagram
- Notes-based touch matching

The engine uses each lesson's title, key terms, facts and existing note field, which are the same data passed into the lesson activities and question engine. Questions therefore stay aligned to the digital notes.

The figures from source guides are not copied as scanned publisher art. They are represented as original interactive diagrams through VisualLearning so they can be labelled, revealed, adjusted and annotated on the board.

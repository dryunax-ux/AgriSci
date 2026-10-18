Timed Question Banks and KJSEA Bank Patch

Replace:
- app/questions/page.tsx

Add:
- components/TimedStrandQuestionMenu.tsx
- components/TimedStrandQuestionMenu.module.css
- app/kjsea/page.tsx

The timed bank uses the existing lib/strandQuestionBanks.ts from Phase 10.

Timing rules:
- 100 questions per strand
- 20 seconds per question
- unanswered question at zero seconds is marked missed
- missed questions advance automatically
- answered questions show feedback then use Next
- final report gives correct, incorrect and missed totals

To show KJSEA in the hamburger drawer, add the supplied item from HamburgerMenu_KJSEA_SNIPPET.txt to mainItems in components/HamburgerMenu.tsx.

# Section B question-number and image correction

## Cause

Section B questions were stored as a separate array and often had local IDs such as 1, 2, 3. The display and image lookup treated those local IDs as printed paper numbers. For a 20-question Section A, Section B item 1 must display as Question 21, not Question 1.

## Add/replace

- Add `lib/kjseaQuestionNumbering.ts`
- Replace `lib/kjseaQuestionImageMap.ts`
- Replace `components/KjseaQuestionFigure.tsx`

## Registry correction

In `lib/kjseaPapers.ts` import:

```ts
import { normalizeKjseaPaper } from "./kjseaQuestionImageMap";
```

Normalize the six-paper registry:

```ts
export const kjseaPapers = [
  grade7AgriculturePaper,
  grade7SciencePaper,
  grade8AgriculturePaper,
  grade8SciencePaper,
  grade9AgriculturePaper,
  grade9SciencePaper,
].map(normalizeKjseaPaper);
```

Remove any earlier `.map(withCorrectKjseaQuestionImages)` call.

## Component correction

In `components/KjseaDigitalPaper.tsx`, the visible number and figure must use `printedNumber`.

For Section A:

```tsx
const question = paper.mcq[currentIndex];
const printedNumber = Number(question.printedNumber ?? currentIndex + 1);
```

For Section B:

```tsx
{paper.structured.map((question, index) => {
  const printedNumber = Number(
    question.printedNumber ?? paper.mcq.length + index + 1
  );

  return (
    <section key={printedNumber}>
      <h3>Question {printedNumber}</h3>
      <p>{String(question.q ?? question.prompt ?? question.question ?? "")}</p>
      <KjseaQuestionFigure
        paperSlug={paper.slug}
        printedNumber={printedNumber}
        alt={`${paper.title}, question ${printedNumber}`}
      />
      {/* existing answer fields */}
    </section>
  );
})}
```

Import the figure component:

```ts
import KjseaQuestionFigure from "./KjseaQuestionFigure";
```

## Remove old numbering logic

Delete Section B code using any of these as the visible paper question number:

```ts
index + 1
question.id
question.number
```

unless it reads the normalized `printedNumber` first.

## Expected Section B starts

- Grade 7 Agriculture: Q21
- Grade 7 Science: Q21
- Grade 8 Agriculture: Q21
- Grade 8 Science: Q21
- Grade 9 Agriculture: Q31
- Grade 9 Science: Q31

## Visual check

- Grade 7 Agriculture Q21, Q25, Q27
- Grade 7 Science Q21, Q24, Q29, Q30
- Grade 8 Agriculture Q21, Q25, Q28
- Grade 8 Science Q21, Q27, Q29
- Grade 9 Agriculture Q31, Q38
- Grade 9 Science Q31, Q33, Q36, Q40

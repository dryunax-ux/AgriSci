# Restore Joachim's original KJSEA manual mappings

This patch ignores all old local IDs and stale image assignments.

## 1. Add the file

Upload:

```text
lib/kjseaRestoreManualMappings.ts
```

## 2. Update `lib/kjseaPapers.ts`

Import:

```ts
import { restoreManualKjseaMappings } from "./kjseaRestoreManualMappings";
```

Build the registry exactly once:

```ts
export const kjseaPapers = [
  grade7AgriculturePaper,
  grade7SciencePaper,
  grade8AgriculturePaper,
  grade8SciencePaper,
  grade9AgriculturePaper,
  grade9SciencePaper,
].map(restoreManualKjseaMappings);
```

Remove earlier registry transforms such as:

```ts
.map(normalizeKjseaPaper)
.map(withCorrectKjseaQuestionImages)
```

Do not chain more than one mapping function.

## 3. Update `components/KjseaDigitalPaper.tsx`

Use the normalized fields already attached to each question:

```tsx
const printedNumber = Number(question.printedNumber);
```

Display the image directly from the question record:

```tsx
{question.figure ? (
  <figure className="kjseaQuestionFigure">
    <img
      src={String(question.figure)}
      alt={`${paper.title}, question ${printedNumber}`}
    />
  </figure>
) : null}
```

For Section B, never use `index + 1`, `question.id`, or `question.number` as the displayed paper number.

```tsx
<h3>Question {Number(question.printedNumber)}</h3>
```

## 4. Remove conflicting runtime image lookups

Remove imports/usages of:

```text
KjseaQuestionFigure
getKjseaQuestionImage
kjseaQuestionImageMap
kjseaQuestionNumbering
```

The exact figure path now lives directly inside the correct question record.

## Expected starts

- Grade 7 and 8 Section B: Question 21
- Grade 9 Section B: Question 31

The supplied mapping contains exactly 47 visuals and follows Joachim's original manual question list.

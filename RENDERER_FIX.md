# Renderer-only fix: no question records need editing

This fix deliberately ignores every existing `question.figure` field. It calculates the printed paper number from the section and array index, then uses Joachim's original manual mapping.

## Upload

- `lib/kjseaManualFigureMap.ts`
- `components/KjseaMappedFigure.tsx`

## Edit one renderer file

Open `components/KjseaDigitalPaper.tsx` and add:

```tsx
import KjseaMappedFigure from "./KjseaMappedFigure";
```

### Section A

Find the old Section A image block, usually:

```tsx
{q.figure && <img src={q.figure} ... />}
```

Delete it and insert:

```tsx
<KjseaMappedFigure
  paperSlug={paper.slug}
  section="A"
  index={idx}
  sectionACount={paper.mcq.length}
  title={paper.title}
/>
```

Use the actual Section A index variable if it is named `i`, `index`, or `idx`.

### Section B

Find the old structured image block, usually:

```tsx
{x.figure && <img src={x.figure} ... />}
```

Delete it and insert inside `paper.structured.map((x, i) => ...)`:

```tsx
<KjseaMappedFigure
  paperSlug={paper.slug}
  section="B"
  index={i}
  sectionACount={paper.mcq.length}
  title={paper.title}
/>
```

Also display the Section B number using the same formula:

```tsx
QUESTION {paper.mcq.length + i + 1} · {x.marks} MARKS
```

## Critical cleanup

Remove or stop using all of these in the renderer:

```tsx
question.figure
x.figure
q.figure
paper.images[index]
getKjseaQuestionImage(...)
question.id // for the visible Section B number
```

Do not edit `lib/kjseaDigitalPapers.ts` question by question.

## Exact Grade 9 Science result

- Section B index 0 -> printed Q31 -> skull
- Section B index 2 -> printed Q33 -> shoe
- Section B index 5 -> printed Q36 -> heating graph
- Section B index 9 -> printed Q40 -> circuit

## If the paper type lacks slug

The `paper` object must expose `slug`. If the current type `P` omits it, add:

```ts
slug: string;
title: string;
```

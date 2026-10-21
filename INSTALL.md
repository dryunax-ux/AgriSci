# KJSEA printed-question-number image correction

This patch fixes diagrams that are in the correct grade and learning area but shown under the wrong question number.

## Why the mismatch happened

The previous logic associated figures with an array position such as `questions[index]`. Section A and Section B use separate arrays, so index 0 can mean Question 1 in Section A and Question 21 in Section B. The new logic uses two values only:

1. exact paper slug;
2. printed question number from the source paper.

## Add these files

- `lib/kjseaQuestionImageMap.ts`
- `components/KjseaQuestionFigure.tsx`

## Apply the mapping to the paper registry

Open `lib/kjseaPapers.ts`. Import the helper:

```ts
import { withCorrectKjseaQuestionImages } from "./kjseaQuestionImageMap";
```

Wrap every imported paper when building the registry:

```ts
export const kjseaPapers = [
  grade7AgriculturePaper,
  grade7SciencePaper,
  grade8AgriculturePaper,
  grade8SciencePaper,
  grade9AgriculturePaper,
  grade9SciencePaper,
].map(withCorrectKjseaQuestionImages);
```

If your registry already exports a differently named array, keep its name and only add `.map(withCorrectKjseaQuestionImages)`.

## Display the image by printed question number

In `components/KjseaDigitalPaper.tsx`, do not select a figure by `currentIndex`, `index + 1`, or a combined-array position. Import:

```ts
import KjseaQuestionFigure from "./KjseaQuestionFigure";
```

Then render it after the question text and before the options/answer spaces:

```tsx
<KjseaQuestionFigure
  paperSlug={paper.slug}
  questionNumber={Number(question.id ?? question.number)}
  alt={`${paper.title}, question ${question.id ?? question.number}`}
/>
```

Remove any old image lookup using `currentIndex`, `questionIndex`, `index + 1`, or `paper.images[index]`.

## CSS

Copy `KJSEA_IMAGE_FIX_CSS.txt` to the end of `app/globals.css`.

## Public image paths expected

The deployed board already shows the supplied images. This patch expects the existing assets under:

- `public/kjsea/images/grade-7-agriculture/q2.jpg`
- `public/kjsea/images/grade-7-science/q2.jpg`
- and the corresponding paper/question folders listed in the map.

## Verification

After Vercel shows **Ready**, hard-refresh and test:

- Grade 7 Agriculture: Q2, Q8, Q14, Q20, Q21, Q25, Q27
- Grade 7 Science: Q2, Q10, Q17, Q21, Q24, Q29, Q30
- Grade 8 Agriculture: Q3, Q5, Q15, Q19, Q21, Q25, Q28
- Grade 8 Science: Q7, Q12, Q18, Q21, Q27, Q29
- Grade 9 Agriculture: Q4, Q7, Q14, Q19, Q27, Q31, Q38
- Grade 9 Science: Q1, Q10, Q11, Q13, Q18, Q20, Q23, Q27, Q28, Q31, Q33, Q36, Q40

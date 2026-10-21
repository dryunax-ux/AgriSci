import { getPrintedQuestionNumber, withPrintedQuestionNumbers, type KjseaPaper, type KjseaQuestion } from "./kjseaQuestionNumbering";

const IMAGE_ROOT = "/kjsea/images";

export const KJSEA_QUESTION_IMAGES: Record<string, Record<number, string>> = {
  "grade-7-agriculture": {2:`${IMAGE_ROOT}/grade-7-agriculture/q2.jpg`,8:`${IMAGE_ROOT}/grade-7-agriculture/q8.jpg`,14:`${IMAGE_ROOT}/grade-7-agriculture/q14.jpg`,20:`${IMAGE_ROOT}/grade-7-agriculture/q20.jpg`,21:`${IMAGE_ROOT}/grade-7-agriculture/q21.jpg`,25:`${IMAGE_ROOT}/grade-7-agriculture/q25.jpg`,27:`${IMAGE_ROOT}/grade-7-agriculture/q27.jpg`},
  "grade-7-science": {2:`${IMAGE_ROOT}/grade-7-science/q2.jpg`,10:`${IMAGE_ROOT}/grade-7-science/q10.jpg`,17:`${IMAGE_ROOT}/grade-7-science/q17.jpg`,21:`${IMAGE_ROOT}/grade-7-science/q21.jpg`,24:`${IMAGE_ROOT}/grade-7-science/q24.jpg`,29:`${IMAGE_ROOT}/grade-7-science/q29.jpg`,30:`${IMAGE_ROOT}/grade-7-science/q30.jpg`},
  "grade-8-agriculture": {3:`${IMAGE_ROOT}/grade-8-agriculture/q3.jpg`,5:`${IMAGE_ROOT}/grade-8-agriculture/q5.jpg`,15:`${IMAGE_ROOT}/grade-8-agriculture/q15.jpg`,19:`${IMAGE_ROOT}/grade-8-agriculture/q19.jpg`,21:`${IMAGE_ROOT}/grade-8-agriculture/q21.jpg`,25:`${IMAGE_ROOT}/grade-8-agriculture/q25.jpg`,28:`${IMAGE_ROOT}/grade-8-agriculture/q28.jpg`},
  "grade-8-science": {7:`${IMAGE_ROOT}/grade-8-science/q7.jpg`,12:`${IMAGE_ROOT}/grade-8-science/q12.jpg`,18:`${IMAGE_ROOT}/grade-8-science/q18.jpg`,21:`${IMAGE_ROOT}/grade-8-science/q21.jpg`,27:`${IMAGE_ROOT}/grade-8-science/q27.jpg`,29:`${IMAGE_ROOT}/grade-8-science/q29.jpg`},
  "grade-9-agriculture": {4:`${IMAGE_ROOT}/grade-9-agriculture/q4.jpg`,7:`${IMAGE_ROOT}/grade-9-agriculture/q7.jpg`,14:`${IMAGE_ROOT}/grade-9-agriculture/q14.jpg`,19:`${IMAGE_ROOT}/grade-9-agriculture/q19.jpg`,27:`${IMAGE_ROOT}/grade-9-agriculture/q27.jpg`,31:`${IMAGE_ROOT}/grade-9-agriculture/q31.jpg`,38:`${IMAGE_ROOT}/grade-9-agriculture/q38.jpg`},
  "grade-9-science": {1:`${IMAGE_ROOT}/grade-9-science/q1.jpg`,10:`${IMAGE_ROOT}/grade-9-science/q10.jpg`,11:`${IMAGE_ROOT}/grade-9-science/q11.jpg`,13:`${IMAGE_ROOT}/grade-9-science/q13.jpg`,18:`${IMAGE_ROOT}/grade-9-science/q18.jpg`,20:`${IMAGE_ROOT}/grade-9-science/q20.jpg`,23:`${IMAGE_ROOT}/grade-9-science/q23.jpg`,27:`${IMAGE_ROOT}/grade-9-science/q27.jpg`,28:`${IMAGE_ROOT}/grade-9-science/q28.jpg`,31:`${IMAGE_ROOT}/grade-9-science/q31.jpg`,33:`${IMAGE_ROOT}/grade-9-science/q33.jpg`,36:`${IMAGE_ROOT}/grade-9-science/q36.jpg`,40:`${IMAGE_ROOT}/grade-9-science/q40.jpg`},
};

export function getKjseaQuestionImage(paperSlug: string, printedNumber: number) {
  return KJSEA_QUESTION_IMAGES[paperSlug]?.[printedNumber];
}

function clearOldImage(question: KjseaQuestion) {
  const fixed = { ...question };
  for (const key of ["image","imageSrc","figure","figureSrc","visual"]) delete fixed[key];
  return fixed;
}

export function normalizeKjseaPaper<T extends KjseaPaper>(input: T): T {
  const paper = withPrintedQuestionNumbers(input);
  const attach = (question: KjseaQuestion, fallback: number) => {
    const fixed = clearOldImage(question);
    const printedNumber = getPrintedQuestionNumber(fixed, fallback);
    const figure = getKjseaQuestionImage(paper.slug, printedNumber);
    return { ...fixed, printedNumber, ...(figure ? { figure } : {}) };
  };

  return {
    ...paper,
    mcq: (paper.mcq ?? []).map((q, i) => attach(q, i + 1)),
    structured: (paper.structured ?? []).map((q, i) => attach(q, (paper.mcq?.length ?? 0) + i + 1)),
  } as T;
}

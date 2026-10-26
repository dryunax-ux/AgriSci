export type KjseaQuestion = Record<string, unknown>;

export type KjseaPaper = {
  slug: string;
  mcq: KjseaQuestion[];
  structured: KjseaQuestion[];
  [key: string]: unknown;
};

const ROOT = "/kjsea/images";

/** Joachim's original manual image mapping. */
export const MANUAL_KJSEA_IMAGE_MAP: Record<string, Record<number, string>> = {
  "grade-7-agriculture": {
    2: `${ROOT}/grade-7-agriculture/q2.jpg`,
    8: `${ROOT}/grade-7-agriculture/q8.jpg`,
    14: `${ROOT}/grade-7-agriculture/q14.jpg`,
    20: `${ROOT}/grade-7-agriculture/q20.jpg`,
    21: `${ROOT}/grade-7-agriculture/q21.jpg`,
    25: `${ROOT}/grade-7-agriculture/q25.jpg`,
    27: `${ROOT}/grade-7-agriculture/q27.jpg`,
  },
  "grade-7-science": {
    2: `${ROOT}/grade-7-science/q2.jpg`,
    10: `${ROOT}/grade-7-science/q10.jpg`,
    17: `${ROOT}/grade-7-science/q17.jpg`,
    21: `${ROOT}/grade-7-science/q21.jpg`,
    24: `${ROOT}/grade-7-science/q24.jpg`,
    29: `${ROOT}/grade-7-science/q29.jpg`,
    30: `${ROOT}/grade-7-science/q30.jpg`,
  },
  "grade-8-agriculture": {
    3: `${ROOT}/grade-8-agriculture/q3.jpg`,
    5: `${ROOT}/grade-8-agriculture/q5.jpg`,
    15: `${ROOT}/grade-8-agriculture/q15.jpg`,
    19: `${ROOT}/grade-8-agriculture/q19.jpg`,
    21: `${ROOT}/grade-8-agriculture/q21.jpg`,
    25: `${ROOT}/grade-8-agriculture/q25.jpg`,
    28: `${ROOT}/grade-8-agriculture/q28.jpg`,
  },
  "grade-8-science": {
    7: `${ROOT}/grade-8-science/q7.jpg`,
    12: `${ROOT}/grade-8-science/q12.jpg`,
    18: `${ROOT}/grade-8-science/q18.jpg`,
    21: `${ROOT}/grade-8-science/q21.jpg`,
    27: `${ROOT}/grade-8-science/q27.jpg`,
    29: `${ROOT}/grade-8-science/q29.jpg`,
  },
  "grade-9-agriculture": {
    4: `${ROOT}/grade-9-agriculture/q4.jpg`,
    7: `${ROOT}/grade-9-agriculture/q7.jpg`,
    14: `${ROOT}/grade-9-agriculture/q14.jpg`,
    19: `${ROOT}/grade-9-agriculture/q19.jpg`,
    27: `${ROOT}/grade-9-agriculture/q27.jpg`,
    31: `${ROOT}/grade-9-agriculture/q31.jpg`,
    38: `${ROOT}/grade-9-agriculture/q38.jpg`,
  },
  "grade-9-science": {
    1: `${ROOT}/grade-9-science/q1.jpg`,
    10: `${ROOT}/grade-9-science/q10.jpg`,
    11: `${ROOT}/grade-9-science/q11.jpg`,
    13: `${ROOT}/grade-9-science/q13.jpg`,
    18: `${ROOT}/grade-9-science/q18.jpg`,
    20: `${ROOT}/grade-9-science/q20.jpg`,
    23: `${ROOT}/grade-9-science/q23.jpg`,
    27: `${ROOT}/grade-9-science/q27.jpg`,
    28: `${ROOT}/grade-9-science/q28.jpg`,
    31: `${ROOT}/grade-9-science/q31.jpg`,
    33: `${ROOT}/grade-9-science/q33.jpg`,
    36: `${ROOT}/grade-9-science/q36.jpg`,
    40: `${ROOT}/grade-9-science/q40.jpg`,
  },
};

function removeOldVisualFields(question: KjseaQuestion): KjseaQuestion {
  const clean = { ...question };
  for (const key of [
    "image",
    "imageSrc",
    "figure",
    "figureSrc",
    "visual",
    "visualSrc",
    "printedNumber",
    "questionNumber",
  ]) {
    delete clean[key];
  }
  return clean;
}

/**
 * Restores printed numbering from section order only.
 * It deliberately ignores old id/number fields because those caused the mix-up.
 */
export function restoreManualKjseaMappings<T extends KjseaPaper>(paper: T): T {
  const sectionACount = paper.mcq.length;
  const manual = MANUAL_KJSEA_IMAGE_MAP[paper.slug] ?? {};

  const mcq = paper.mcq.map((question, index) => {
    const printedNumber = index + 1;
    const figure = manual[printedNumber];
    return {
      ...removeOldVisualFields(question),
      printedNumber,
      ...(figure ? { figure } : {}),
    };
  });

  const structured = paper.structured.map((question, index) => {
    const printedNumber = sectionACount + index + 1;
    const figure = manual[printedNumber];
    return {
      ...removeOldVisualFields(question),
      printedNumber,
      ...(figure ? { figure } : {}),
    };
  });

  return { ...paper, mcq, structured } as T;
}

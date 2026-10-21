export type KjseaQuestion = Record<string, unknown>;
export type KjseaPaper = {
  slug: string;
  mcq?: KjseaQuestion[];
  structured?: KjseaQuestion[];
  [key: string]: unknown;
};

function readNumber(question: KjseaQuestion): number | undefined {
  const raw = question.printedNumber ?? question.questionNumber ?? question.number ?? question.qno ?? question.id;
  if (raw === undefined || raw === null || raw === "") return undefined;
  const match = String(raw).match(/\d+/);
  if (!match) return undefined;
  const value = Number.parseInt(match[0], 10);
  return Number.isFinite(value) ? value : undefined;
}

/**
 * Creates one authoritative printedNumber for every question.
 * Section A is numbered 1..MCQ count.
 * Section B continues after Section A unless its source number is already
 * a valid absolute printed number.
 */
export function withPrintedQuestionNumbers<T extends KjseaPaper>(paper: T): T {
  const mcq = (paper.mcq ?? []).map((question, index) => ({
    ...question,
    printedNumber: (() => {
      const source = readNumber(question);
      return source && source >= 1 && source <= (paper.mcq?.length ?? 0) ? source : index + 1;
    })(),
  }));

  const sectionBStart = mcq.length + 1;
  const structured = (paper.structured ?? []).map((question, index) => {
    const source = readNumber(question);
    const printedNumber = source && source >= sectionBStart ? source : sectionBStart + index;
    return { ...question, printedNumber };
  });

  return { ...paper, mcq, structured } as T;
}

export function getPrintedQuestionNumber(question: KjseaQuestion, fallback: number): number {
  return readNumber(question) ?? fallback;
}

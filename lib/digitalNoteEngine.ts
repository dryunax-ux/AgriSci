import { getGrade8AgricultureRichNote } from "./grade8AgricultureRichNotes";
import { getGrade8ScienceRichNote } from "./grade8ScienceRichNotes";
import { getGrade9AgricultureRichNote } from "./grade9AgricultureRichNotes";
import { getGrade9ScienceRichNote } from "./grade9ScienceRichNotes";

export type DigitalNote = {
  title: string;
  overview: string;
  explanations: string[];
  procedure: string[];
  safety: string[];
  summary: string[];
  misconceptions: { claim: string; correction: string }[];
  oralQuestions: string[];
  diagramPrompt: string;
};

export function buildDigitalNote(
  title: string,
  terms: readonly string[],
  facts: readonly string[],
  providedNote?: string,
): DigitalNote {
  const rich =
    getGrade8AgricultureRichNote(title) ||
    getGrade8ScienceRichNote(title) ||
    getGrade9AgricultureRichNote(title) ||
    getGrade9ScienceRichNote(title);

  if (rich) return { title, ...rich };

  const overview =
    providedNote ||
    `${title} is understood by connecting accurate vocabulary, observable evidence and safe application.`;

  return {
    title,
    overview,
    explanations: [...facts],
    procedure: ["Observe", "Identify", "Plan", "Apply", "Record", "Evaluate"],
    safety: [
      "Follow teacher-approved procedures",
      "Inspect tools and materials",
      "Record evidence honestly",
    ],
    summary: [...facts, "Support conclusions with evidence"].slice(0, 5),
    misconceptions: [
      {
        claim: "Evidence is unnecessary.",
        correction: "Evidence supports a reliable conclusion.",
      },
    ],
    oralQuestions: [
      `What is ${title}?`,
      "Which evidence supports the explanation?",
      "Where is this applied locally?",
    ],
    diagramPrompt: `Use the interactive figure to label, sequence or explain ${title.toLowerCase()}.`,
  };
}

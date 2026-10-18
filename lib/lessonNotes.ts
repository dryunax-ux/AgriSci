import { conservationLessons } from "./phase2";
import { foodProductionLessons } from "./phase3";
import { householdSkillsLessons } from "./phase4";
import { grade8ScienceLessons } from "./phase5";
import { grade9AgricultureLessons } from "./phase6";
import { grade9ScienceLessons } from "./phase7";
import { grade8WellbeingLessons } from "./phase8";

export type NoteLesson = {
  grade: 8 | 9;
  subject: "agriculture" | "integrated-science";
  strand: string;
  substrand: string;
  number: number;
  slug: string;
  title: string;
  outcome: string;
  inquiry: string;
  notes: string;
  terms: readonly string[];
  facts: readonly string[];
  competency: string;
  value: string;
};

type RawLesson = {
  substrand: string;
  strand?: string;
  number: number;
  slug: string;
  title: string;
  outcome?: string;
  inquiry?: string;
  notes?: string;
  terms?: readonly string[];
  facts?: readonly string[];
  competency?: string;
  value?: string;
};

const strandNames: Record<string, string> = {
  "soil-conservation-measures": "Conservation of Resources",
  "water-harvesting-and-storage": "Conservation of Resources",
  "kitchen-and-backyard-gardening": "Food Production Processes",
  "poultry-rearing-in-a-fold": "Food Production Processes",
  "crop-pest-and-disease-control": "Food Production Processes",
  "preparation-of-animal-products": "Food Production Processes",
  "preserving-animal-products": "Food Production Processes",
  "cooking-preparing-a-balanced-meal": "Food Production Processes",
  "cleaning-the-kitchen": "Hygiene Practices",
  "sewing-skills-constructing-household-items": "Production Techniques",
  "constructing-innovative-animal-waterer": "Production Techniques",
  "ict-support-services": "Production Techniques",
  "reproduction-in-human-beings": "Living Things and their Environment",
};

function readable(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalize(
  items: readonly RawLesson[],
  grade: 8 | 9,
  subject: "agriculture" | "integrated-science",
): NoteLesson[] {
  return items.map((item) => ({
    grade,
    subject,
    strand: item.strand || strandNames[item.substrand] || "Curriculum Strand",
    substrand: item.substrand,
    number: item.number,
    slug: item.slug,
    title: item.title,
    outcome: item.outcome || `Explain and apply the main ideas in ${item.title.toLowerCase()}.`,
    inquiry: item.inquiry || `How can understanding ${item.title.toLowerCase()} help solve a familiar problem?`,
    notes:
      item.notes ||
      `${item.title} is studied through observation, discussion, modelling and practical application. Learners connect the idea to familiar school, home and community situations, collect relevant evidence and explain conclusions clearly.`,
    terms: item.terms || [readable(item.substrand), "evidence", "application"],
    facts: item.facts || [
      `A clear explanation of ${item.title.toLowerCase()} should use accurate terms.`,
      "Evidence should support the conclusion.",
      "Safety and responsible practice should guide application.",
    ],
    competency: item.competency || "Critical thinking, communication and collaboration",
    value: item.value || "Responsibility, respect and integrity",
  }));
}

export const lessonNotes: NoteLesson[] = [
  ...normalize(conservationLessons as readonly RawLesson[], 8, "agriculture"),
  ...normalize(foodProductionLessons as readonly RawLesson[], 8, "agriculture"),
  ...normalize(householdSkillsLessons as readonly RawLesson[], 8, "agriculture"),
  ...normalize(grade8ScienceLessons as readonly RawLesson[], 8, "integrated-science"),
  ...normalize(grade8WellbeingLessons as readonly RawLesson[], 8, "integrated-science"),
  ...normalize(grade9AgricultureLessons as readonly RawLesson[], 9, "agriculture"),
  ...normalize(grade9ScienceLessons as readonly RawLesson[], 9, "integrated-science"),
];

export function lessonNotePath(lesson: NoteLesson) {
  return `/notes/${lesson.grade}/${lesson.subject}/${lesson.substrand}/${lesson.slug}`;
}

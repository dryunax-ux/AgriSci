"use client";

import { useMemo, useState } from "react";
import { buildDigitalNote } from "../lib/digitalNoteEngine";

type Props = {
  facts: readonly string[];
  title: string;
};

type MCQ = {
  prompt: string;
  options: [string, string, string, string];
  answer: number;
  explanation: string;
  noteSection: string;
};

type TrueFalse = {
  statement: string;
  answer: boolean;
  explanation: string;
  noteSection: string;
};

function unique(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function opposite(statement: string, variant: number) {
  const replacements: Array<[RegExp, string]> = [
    [/\bslows?\b/i, "speeds up"],
    [/\breduces?\b/i, "increases"],
    [/\bincreases?\b/i, "reduces"],
    [/\bprotects?\b/i, "damages"],
    [/\bcovered\b/i, "uncovered"],
    [/\bclean\b/i, "contaminated"],
    [/\bsafe\b/i, "unsafe"],
    [/\bacross the slope\b/i, "down the slope"],
    [/\balong the contour\b/i, "directly down the slope"],
    [/\bshould\b/i, "should not"],
    [/\bmust\b/i, "must not"],
    [/\bcorrect\b/i, "incorrect"],
    [/\bregular\b/i, "unnecessary"],
    [/\bstable\b/i, "unstable"],
    [/\bappropriate\b/i, "unrelated"],
  ];

  for (let offset = 0; offset < replacements.length; offset += 1) {
    const [pattern, replacement] = replacements[(variant + offset) % replacements.length];
    if (pattern.test(statement)) return statement.replace(pattern, replacement);
  }

  const fallbacks = [
    `The opposite practice should always be used instead of this note: ${statement}`,
    `This action can be ignored without affecting the result: ${statement}`,
    `No evidence or safety check is needed when applying this idea: ${statement}`,
  ];
  return fallbacks[variant % fallbacks.length];
}

function buildOptions(correct: string, index: number): [string, string, string, string] {
  const distractors = unique([
    opposite(correct, index),
    opposite(correct, index + 5),
    opposite(correct, index + 10),
  ]);

  while (distractors.length < 3) {
    distractors.push(`An unrelated method should replace the note: ${correct}`);
  }

  const answer = index % 4;
  const options = distractors.slice(0, 3);
  options.splice(answer, 0, correct);
  return options as [string, string, string, string];
}

export default function LessonQuiz({ facts, title }: Props) {
  const digitalNote = useMemo(
    () => buildDigitalNote(title, [], facts),
    [title, facts],
  );

  const noteSources = useMemo(
    () =>
      unique([
        ...digitalNote.explanations,
        ...digitalNote.summary,
        ...digitalNote.procedure,
        ...digitalNote.safety,
      ]),
    [digitalNote],
  );

  const mcqs = useMemo<MCQ[]>(
    () =>
      Array.from({ length: 15 }, (_, index) => {
        const sections = [
          { name: "Core Notes", values: digitalNote.explanations },
          { name: "Summary", values: digitalNote.summary },
          { name: "Process", values: digitalNote.procedure },
          { name: "Safety", values: digitalNote.safety },
        ];
        const section = sections[index % sections.length];
        const correct =
          section.values[Math.floor(index / sections.length) % section.values.length] ||
          noteSources[index % noteSources.length];
        const answer = index % 4;

        const prompts = [
          `Which statement agrees with the ${section.name.toLowerCase()} for ${title.toLowerCase()}?`,
          `Which option should a learner select after studying the ${section.name.toLowerCase()}?`,
          `Which statement correctly applies the lesson notes on ${title.toLowerCase()}?`,
          `Which conclusion is supported by the ${section.name.toLowerCase()}?`,
        ];

        return {
          prompt: `${index + 1}. ${prompts[index % prompts.length]}`,
          options: buildOptions(correct, index),
          answer,
          explanation: correct,
          noteSection: section.name,
        };
      }),
    [digitalNote, noteSources, title],
  );

  const trueFalse = useMemo<TrueFalse[]>(
    () =>
      Array.from({ length: 15 }, (_, index) => {
        const correctStatement = noteSources[(index * 2) % noteSources.length];
        const isTrue = index % 2 === 0;
        return {
          statement: isTrue ? correctStatement : opposite(correctStatement, index),
          answer: isTrue,
          explanation: isTrue
            ? correctStatement
            : `The digital notes state: ${correctStatement}`,
          noteSection:
            index % 4 === 0
              ? "Core Notes"
              : index % 4 === 1
                ? "Process"
                : index % 4 === 2
                  ? "Safety"
                  : "Summary",
        };
      }),
    [noteSources],
  );

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<number, number>>({});
  const [sortAnswers, setSortAnswers] = useState<Record<number, string>>({});
  const [application, setApplication] = useState("");
  const [exitTicket, setExitTicket] = useState("");
  const [marked, setMarked] = useState(false);

  const matchingItems = digitalNote.explanations.slice(0, 3);
  const processItems = digitalNote.procedure.slice(0, 3);

  const mcqScore = mcqs.reduce(
    (score, question, index) =>
      score + (mcqAnswers[index] === question.answer ? 1 : 0),
    0,
  );
  const tfScore = trueFalse.reduce(
    (score, question, index) =>
      score + (tfAnswers[index] === question.answer ? 1 : 0),
    0,
  );
  const matchScore = matchingItems.reduce(
    (score, _, index) => score + (matchAnswers[index] === index ? 1 : 0),
    0,
  );
  const sortScore = processItems.reduce(
    (score, _, index) =>
      score + (sortAnswers[index] === String(index + 1) ? 1 : 0),
    0,
  );
  const objectiveTotal = 30 + matchingItems.length + processItems.length;

  return (
    <section className="panel questionbank">
      <span className="kicker">ASSESSMENT FROM THIS LESSON&apos;S DIGITAL NOTES</span>
      <h2>{title}: Notes-based questions</h2>
      <p>
        The questions below are generated from the same Core Notes, Process,
        Safety and Summary sections shown in this lesson.
      </p>

      <details open>
        <summary>15 multiple-choice questions</summary>
        {mcqs.map((question, index) => (
          <fieldset key={index}>
            <legend>
              {question.prompt} <small>Source: {question.noteSection}</small>
            </legend>
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={
                  marked
                    ? optionIndex === question.answer
                      ? "correct"
                      : mcqAnswers[index] === optionIndex
                        ? "wrong"
                        : ""
                    : ""
                }
              >
                <input
                  type="radio"
                  name={`mcq-${title}-${index}`}
                  checked={mcqAnswers[index] === optionIndex}
                  onChange={() =>
                    setMcqAnswers({ ...mcqAnswers, [index]: optionIndex })
                  }
                />
                <b>{String.fromCharCode(65 + optionIndex)}.</b> {option}
              </label>
            ))}
            {marked && (
              <p className="explain">
                <b>Answer from {question.noteSection}:</b> {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
      </details>

      <details>
        <summary>15 true-or-false questions</summary>
        {trueFalse.map((question, index) => (
          <fieldset key={index}>
            <legend>
              {index + 1}. {question.statement}{" "}
              <small>Source: {question.noteSection}</small>
            </legend>
            {[true, false].map((choice) => (
              <label
                key={String(choice)}
                className={
                  marked
                    ? choice === question.answer
                      ? "correct"
                      : tfAnswers[index] === choice
                        ? "wrong"
                        : ""
                    : ""
                }
              >
                <input
                  type="radio"
                  name={`tf-${title}-${index}`}
                  checked={tfAnswers[index] === choice}
                  onChange={() =>
                    setTfAnswers({ ...tfAnswers, [index]: choice })
                  }
                />
                {choice ? "True" : "False"}
              </label>
            ))}
            {marked && <p className="explain">{question.explanation}</p>}
          </fieldset>
        ))}
      </details>

      <details>
        <summary>1 matching activity from the Core Notes</summary>
        {matchingItems.map((item, index) => (
          <label className="option" key={item}>
            <b>{String.fromCharCode(65 + index)}.</b> {item}
            <select
              value={matchAnswers[index] ?? ""}
              onChange={(event) =>
                setMatchAnswers({
                  ...matchAnswers,
                  [index]: Number(event.target.value),
                })
              }
            >
              <option value="">Match</option>
              {matchingItems.map((_, choiceIndex) => (
                <option key={choiceIndex} value={choiceIndex}>
                  Note {choiceIndex + 1}
                </option>
              ))}
            </select>
          </label>
        ))}
        <ol>
          {matchingItems.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </details>

      <details>
        <summary>1 sequencing activity from the Process notes</summary>
        {processItems.map((item, index) => (
          <label className="option" key={item}>
            {item}
            <select
              value={sortAnswers[index] ?? ""}
              onChange={(event) =>
                setSortAnswers({ ...sortAnswers, [index]: event.target.value })
              }
            >
              <option value="">Position</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
        ))}
      </details>

      <details>
        <summary>1 application question</summary>
        <p>
          Using the lesson notes and interactive figure, explain how {title.toLowerCase()}
          could be applied at school or in the local community. Include an action,
          reason, safety control and expected result.
        </p>
        <textarea
          rows={5}
          value={application}
          onChange={(event) => setApplication(event.target.value)}
        />
      </details>

      <details>
        <summary>1 exit ticket</summary>
        <p>
          Write one important idea, one process step, one safety point and one
          question you still have about {title.toLowerCase()}.
        </p>
        <textarea
          rows={4}
          value={exitTicket}
          onChange={(event) => setExitTicket(event.target.value)}
        />
      </details>

      <button className="primary" onClick={() => setMarked(true)}>
        Mark notes-based questions
      </button>

      {marked && (
        <output>
          Objective score: {mcqScore + tfScore + matchScore + sortScore}/
          {objectiveTotal}. Application and exit-ticket responses require teacher review.
        </output>
      )}
    </section>
  );
}

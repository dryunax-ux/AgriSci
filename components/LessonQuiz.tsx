"use client";

import { useMemo, useState } from "react";

type Props = {
  facts: readonly string[];
  title: string;
};

type MCQ = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

type TFQuestion = {
  statement: string;
  answer: boolean;
  explanation: string;
};

const mcqPrompts = [
  "Which statement is scientifically correct?",
  "Which idea best explains this lesson?",
  "Which statement should a learner include in a conclusion?",
  "Which statement is supported by the lesson evidence?",
  "Which statement is suitable for a class presentation?",
];

const genericDistractors = [
  "Evidence is unnecessary when the answer sounds familiar.",
  "Every situation should be handled in exactly the same way.",
  "Safety checks can be skipped when an activity is simple.",
  "A conclusion should be based only on personal preference.",
  "Reliable records are not needed during an investigation.",
  "The first idea suggested is always the correct one.",
];

function makeFalseStatement(fact: string, index: number) {
  const openings = [
    "It is incorrect to claim that ",
    "Evidence does not support the claim that ",
    "A learner should reject the idea that ",
  ];
  return `${openings[index % openings.length]}${fact.charAt(0).toLowerCase()}${fact.slice(1)}.`;
}

export default function LessonQuiz({ facts, title }: Props) {
  const safeFacts = facts.length >= 3
    ? [...facts]
    : [
        ...facts,
        "Accurate observations support a conclusion",
        "Safe procedures should be followed",
        "Evidence should be recorded clearly",
      ].slice(0, 3);

  const mcqs = useMemo<MCQ[]>(() => {
    return Array.from({ length: 15 }, (_, index) => {
      const correct = safeFacts[index % safeFacts.length];
      const distractorStart = (index * 2) % genericDistractors.length;
      const distractors = [
        genericDistractors[distractorStart],
        genericDistractors[(distractorStart + 1) % genericDistractors.length],
        genericDistractors[(distractorStart + 2) % genericDistractors.length],
      ];
      const answer = index % 4;
      const options = [...distractors];
      options.splice(answer, 0, correct);
      return {
        prompt: `${index + 1}. ${mcqPrompts[index % mcqPrompts.length]}`,
        options,
        answer,
        explanation: `${correct} This is the lesson idea supported by the notes and activity.`,
      };
    });
  }, [safeFacts]);

  const trueFalse = useMemo<TFQuestion[]>(() => {
    return Array.from({ length: 15 }, (_, index) => {
      const fact = safeFacts[index % safeFacts.length];
      const isTrue = index % 2 === 0;
      return {
        statement: isTrue ? fact : makeFalseStatement(fact, index),
        answer: isTrue,
        explanation: isTrue
          ? `${fact} This statement agrees with the lesson.`
          : `The statement is false. The supported lesson statement is: ${fact}`,
      };
    });
  }, [safeFacts]);

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<number, number>>({});
  const [sortAnswers, setSortAnswers] = useState<Record<number, string>>({});
  const [applicationAnswer, setApplicationAnswer] = useState("");
  const [exitAnswer, setExitAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mcqScore = mcqs.reduce(
    (score, question, index) => score + (mcqAnswers[index] === question.answer ? 1 : 0),
    0,
  );
  const tfScore = trueFalse.reduce(
    (score, question, index) => score + (tfAnswers[index] === question.answer ? 1 : 0),
    0,
  );
  const matchScore = safeFacts.reduce(
    (score, _, index) => score + (matchAnswers[index] === index ? 1 : 0),
    0,
  );
  const sortItems = [
    "Make a prediction",
    "Collect or examine evidence",
    "Explain the finding",
  ];
  const sortScore = sortItems.reduce(
    (score, _, index) => score + (sortAnswers[index] === String(index + 1) ? 1 : 0),
    0,
  );
  const objectiveScore = mcqScore + tfScore + matchScore + sortScore;
  const objectiveTotal = 15 + 15 + safeFacts.length + sortItems.length;

  function submitBank() {
    setSubmitted(true);
    try {
      localStorage.setItem(
        `question-bank-${title}`,
        JSON.stringify({ mcqScore, tfScore, matchScore, sortScore, objectiveTotal }),
      );
    } catch {
      // The bank still works when browser storage is unavailable.
    }
  }

  return (
    <section className="panel questionbank">
      <span className="kicker">EXPANDED QUESTION BANK</span>
      <h2>{title}</h2>
      <p>
        This bank contains <b>15 multiple-choice</b>, <b>15 true-or-false</b>,
        and one each of matching, sorting, application and exit-ticket questions.
      </p>

      <details open>
        <summary>15 Multiple-choice questions</summary>
        {mcqs.map((question, index) => (
          <fieldset key={index}>
            <legend>{question.prompt}</legend>
            {question.options.map((option, optionIndex) => (
              <label
                key={`${index}-${optionIndex}`}
                className={
                  submitted
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
                {option}
              </label>
            ))}
            {submitted && <p className="explain">{question.explanation}</p>}
          </fieldset>
        ))}
      </details>

      <details>
        <summary>15 True-or-false questions</summary>
        {trueFalse.map((question, index) => (
          <fieldset key={index}>
            <legend>{index + 1}. {question.statement}</legend>
            {[true, false].map((choice) => (
              <label
                key={String(choice)}
                className={
                  submitted
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
                  onChange={() => setTfAnswers({ ...tfAnswers, [index]: choice })}
                />
                {choice ? "True" : "False"}
              </label>
            ))}
            {submitted && <p className="explain">{question.explanation}</p>}
          </fieldset>
        ))}
      </details>

      <details>
        <summary>1 Matching question</summary>
        <p>Match each lesson statement to its numbered meaning.</p>
        {safeFacts.map((fact, index) => (
          <label className="option" key={fact}>
            <b>{String.fromCharCode(65 + index)}.</b> {fact}
            <select
              value={matchAnswers[index] ?? ""}
              onChange={(event) =>
                setMatchAnswers({ ...matchAnswers, [index]: Number(event.target.value) })
              }
            >
              <option value="">Choose</option>
              {safeFacts.map((_, choiceIndex) => (
                <option key={choiceIndex} value={choiceIndex}>
                  Meaning {choiceIndex + 1}
                </option>
              ))}
            </select>
          </label>
        ))}
        <ol>
          {safeFacts.map((fact) => <li key={fact}>{fact}</li>)}
        </ol>
      </details>

      <details>
        <summary>1 Sorting or sequencing question</summary>
        <p>Assign the correct position to each stage.</p>
        {sortItems.map((item, index) => (
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
        <summary>1 Application question</summary>
        <p>
          A school team must apply <b>{title.toLowerCase()}</b> using locally
          available materials. Describe the team&apos;s action, evidence, safety
          control and expected result.
        </p>
        <textarea
          rows={5}
          value={applicationAnswer}
          onChange={(event) => setApplicationAnswer(event.target.value)}
          placeholder="Write the application response here..."
        />
        {submitted && (
          <p className="explain">
            Teacher check: award one mark each for a relevant action, supporting
            evidence, safety control and reasonable expected result.
          </p>
        )}
      </details>

      <details>
        <summary>1 Exit-ticket question</summary>
        <p>
          State one idea learned, one piece of evidence and one question still
          remaining about {title.toLowerCase()}.
        </p>
        <textarea
          rows={4}
          value={exitAnswer}
          onChange={(event) => setExitAnswer(event.target.value)}
          placeholder="Idea, evidence and remaining question..."
        />
      </details>

      <button className="primary" onClick={submitBank}>Mark question bank</button>
      {submitted && (
        <output>
          Objective score: {objectiveScore}/{objectiveTotal}. Written application
          and exit-ticket responses require teacher review.
        </output>
      )}
    </section>
  );
}

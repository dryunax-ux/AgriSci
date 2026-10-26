"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./KjseaDigitalPaper.module.css";

type M = {
  id: number;
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
  figure?: string;
};

type S = {
  q: string;
  marks: number;
  scheme: readonly string[];
  minAnswers?: number;
  figure?: string;
};

type P = {
  slug?: string;
  title: string;
  area: string;
  code: string;
  mcq: readonly M[];
  structured: readonly S[];
};

type R = { score: number; feedback: string[] };

const LIMIT = 30;
const IMAGE_ROOT = "/kjsea/images";

// Joachim's authoritative manual image-to-question mapping.
const MANUAL_FIGURES: Record<string, Record<number, string>> = {
  "grade-7-agriculture": {
    2: `${IMAGE_ROOT}/grade-7-agriculture/q2.jpg`,
    8: `${IMAGE_ROOT}/grade-7-agriculture/q8.jpg`,
    14: `${IMAGE_ROOT}/grade-7-agriculture/q14.jpg`,
    20: `${IMAGE_ROOT}/grade-7-agriculture/q20.jpg`,
    21: `${IMAGE_ROOT}/grade-7-agriculture/q21.jpg`,
    25: `${IMAGE_ROOT}/grade-7-agriculture/q25.jpg`,
    27: `${IMAGE_ROOT}/grade-7-agriculture/q27.jpg`,
  },
  "grade-7-science": {
    2: `${IMAGE_ROOT}/grade-7-science/q2.jpg`,
    10: `${IMAGE_ROOT}/grade-7-science/q10.jpg`,
    17: `${IMAGE_ROOT}/grade-7-science/q17.jpg`,
    21: `${IMAGE_ROOT}/grade-7-science/q21.jpg`,
    24: `${IMAGE_ROOT}/grade-7-science/q24.jpg`,
    29: `${IMAGE_ROOT}/grade-7-science/q29.jpg`,
    30: `${IMAGE_ROOT}/grade-7-science/q30.jpg`,
  },
  "grade-8-agriculture": {
    3: `${IMAGE_ROOT}/grade-8-agriculture/q3.jpg`,
    5: `${IMAGE_ROOT}/grade-8-agriculture/q5.jpg`,
    15: `${IMAGE_ROOT}/grade-8-agriculture/q15.jpg`,
    19: `${IMAGE_ROOT}/grade-8-agriculture/q19.jpg`,
    21: `${IMAGE_ROOT}/grade-8-agriculture/q21.jpg`,
    25: `${IMAGE_ROOT}/grade-8-agriculture/q25.jpg`,
    28: `${IMAGE_ROOT}/grade-8-agriculture/q28.jpg`,
  },
  "grade-8-science": {
    7: `${IMAGE_ROOT}/grade-8-science/q7.jpg`,
    12: `${IMAGE_ROOT}/grade-8-science/q12.jpg`,
    18: `${IMAGE_ROOT}/grade-8-science/q18.jpg`,
    21: `${IMAGE_ROOT}/grade-8-science/q21.jpg`,
    27: `${IMAGE_ROOT}/grade-8-science/q27.jpg`,
    29: `${IMAGE_ROOT}/grade-8-science/q29.jpg`,
  },
  "grade-9-agriculture": {
    4: `${IMAGE_ROOT}/grade-9-agriculture/q4.jpg`,
    7: `${IMAGE_ROOT}/grade-9-agriculture/q7.jpg`,
    14: `${IMAGE_ROOT}/grade-9-agriculture/q14.jpg`,
    19: `${IMAGE_ROOT}/grade-9-agriculture/q19.jpg`,
    27: `${IMAGE_ROOT}/grade-9-agriculture/q27.jpg`,
    31: `${IMAGE_ROOT}/grade-9-agriculture/q31.jpg`,
    38: `${IMAGE_ROOT}/grade-9-agriculture/q38.jpg`,
  },
  "grade-9-science": {
    1: `${IMAGE_ROOT}/grade-9-science/q1.jpg`,
    10: `${IMAGE_ROOT}/grade-9-science/q10.jpg`,
    11: `${IMAGE_ROOT}/grade-9-science/q11.jpg`,
    13: `${IMAGE_ROOT}/grade-9-science/q13.jpg`,
    18: `${IMAGE_ROOT}/grade-9-science/q18.jpg`,
    20: `${IMAGE_ROOT}/grade-9-science/q20.jpg`,
    23: `${IMAGE_ROOT}/grade-9-science/q23.jpg`,
    27: `${IMAGE_ROOT}/grade-9-science/q27.jpg`,
    28: `${IMAGE_ROOT}/grade-9-science/q28.jpg`,
    31: `${IMAGE_ROOT}/grade-9-science/q31.jpg`,
    33: `${IMAGE_ROOT}/grade-9-science/q33.jpg`,
    36: `${IMAGE_ROOT}/grade-9-science/q36.jpg`,
    40: `${IMAGE_ROOT}/grade-9-science/q40.jpg`,
  },
};

function inferPaperSlug(paper: P): string {
  if (paper.slug && MANUAL_FIGURES[paper.slug]) return paper.slug;
  const text = `${paper.title} ${paper.area}`.toLowerCase();
  const grade = text.match(/grade\s*([789])/)?.[1];
  const subject = text.includes("agriculture") ? "agriculture" : "science";
  return grade ? `grade-${grade}-${subject}` : "";
}

function mappedFigure(paper: P, printedQuestionNumber: number): string | undefined {
  return MANUAL_FIGURES[inferPaperSlug(paper)]?.[printedQuestionNumber];
}

function QuestionFigure({ paper, number }: { paper: P; number: number }) {
  const src = mappedFigure(paper, number);
  if (!src) return null;
  return (
    <img
      className={styles.figure}
      src={src}
      alt={`${paper.title}, question ${number}`}
      loading="eager"
    />
  );
}

const norm = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

function mark(responses: string[], scheme: readonly string[], max: number): R {
  const used = new Set<number>();
  const feedback: string[] = [];
  responses.forEach((response, index) => {
    const answer = norm(response);
    if (!answer) return;
    const match = scheme.findIndex(
      (point, schemeIndex) =>
        !used.has(schemeIndex) &&
        norm(point).split(" ").filter((word) => word.length > 3 && answer.includes(word)).length >= 1,
    );
    if (match >= 0) {
      used.add(match);
      feedback[index] = `Accepted: ${scheme[match]}`;
    } else {
      feedback[index] = "No marking point matched; teacher may review equivalent wording.";
    }
  });
  return { score: Math.min(max, used.size), feedback };
}

export default function KjseaDigitalPaper({ paper }: { paper: P }) {
  const [section, setSection] = useState<"A" | "B">("A");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(LIMIT);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [missed, setMissed] = useState<number[]>([]);
  const [status, setStatus] = useState<"active" | "answered" | "missed">("active");
  const [done, setDone] = useState(false);
  const [written, setWritten] = useState<Record<number, string[]>>({});
  const [results, setResults] = useState<Record<number, R>>({});
  const [help, setHelp] = useState<Record<number, boolean>>({});
  const lock = useRef(false);

  const item = paper.mcq[index];
  const correct = paper.mcq.reduce((total, question, questionIndex) =>
    total + (answers[questionIndex] === question.answer ? 1 : 0), 0);
  const incorrect = Object.keys(answers).length - correct;

  const next = useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    if (index >= paper.mcq.length - 1) setDone(true);
    else {
      setIndex((value) => value + 1);
      setSeconds(LIMIT);
      setStatus("active");
    }
    setTimeout(() => (lock.current = false), 120);
  }, [index, paper.mcq.length]);

  useEffect(() => {
    if (section !== "A" || !started || done || status !== "active") return;
    if (seconds <= 0) {
      setMissed((values) => values.includes(index) ? values : [...values, index]);
      setStatus("missed");
      return;
    }
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, section, started, done, status, index]);

  useEffect(() => {
    if (status !== "missed" || done) return;
    const timer = setTimeout(next, 1400);
    return () => clearTimeout(timer);
  }, [status, done, next]);

  const required = (question: S) =>
    Math.max(1, question.minAnswers ?? Math.min(question.marks, question.scheme.length));
  const responses = (questionIndex: number, question: S) =>
    written[questionIndex] ?? Array.from({ length: required(question) }, () => "");

  const sectionBScore = useMemo(
    () => Object.values(results).reduce((total, result) => total + result.score, 0),
    [results],
  );
  const sectionBTotal = paper.structured.reduce((total, question) => total + question.marks, 0);
  const totalMarks = paper.mcq.length + sectionBTotal;
  const percentage = (seconds / LIMIT) * 100;
  const timerClass = seconds <= 5 ? styles.red : seconds <= 10 ? styles.amber : styles.green;

  return (
    <main className={styles.wrap}>
      <a href="/kjsea">← KJSEA Sample Paper Bank</a>
      <header>
        <span className={styles.tag}>DIGITAL SAMPLE PAPER</span>
        <h1>{paper.title}</h1>
        <p>{paper.area} · {paper.code} · {totalMarks} marks</p>
      </header>

      <nav>
        <button className={section === "A" ? styles.active : ""} onClick={() => setSection("A")}>Section A</button>
        <button className={section === "B" ? styles.active : ""} onClick={() => setSection("B")}>Section B</button>
      </nav>

      {section === "A" && !started && (
        <section className={styles.card}>
          <h2>Timed multiple choice</h2>
          <p>{paper.mcq.length} questions · 30 seconds each.</p>
          <button onClick={() => setStarted(true)}>Start Section A</button>
        </section>
      )}

      {section === "A" && started && !done && item && (
        <>
          <div className={styles.stats}>
            <b>{index + 1}/{paper.mcq.length}</b><b>{correct} correct</b>
            <b>{incorrect} incorrect</b><b>{missed.length} missed</b>
          </div>
          <article className={styles.card}>
            <h2>{item.prompt}</h2>
            <QuestionFigure paper={paper} number={index + 1} />
            <div className={styles.options}>
              {item.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    disabled={status !== "active"}
                    checked={answers[index] === optionIndex}
                    onChange={() => {
                      setAnswers((values) => ({ ...values, [index]: optionIndex }));
                      setStatus("answered");
                    }}
                  />
                  <b>{String.fromCharCode(65 + optionIndex)}.</b> {option}
                </label>
              ))}
            </div>
            <div className={styles.track}><span className={timerClass} style={{ width: `${percentage}%` }} /></div>
            <p className={styles.time}>{seconds} seconds remaining</p>
            {status === "answered" && answers[index] === item.answer && <p className={styles.good}>Correct.</p>}
            {status === "answered" && answers[index] !== item.answer && (
              <div className={styles.help}><b>Possible response:</b><p>{item.options[item.answer]}</p><small>{item.explanation}</small></div>
            )}
            {status === "missed" && (
              <div className={styles.help}><b>Time expired. Possible response:</b><p>{item.options[item.answer]}</p><small>{item.explanation}</small></div>
            )}
            {status !== "active" && <button onClick={next}>{index === paper.mcq.length - 1 ? "Finish" : "Next question →"}</button>}
          </article>
        </>
      )}

      {section === "A" && done && (
        <section className={styles.card}>
          <h2>Section A: {correct}/{paper.mcq.length}</h2>
          <p>Incorrect: {incorrect} · Missed: {missed.length}</p>
          <button onClick={() => setSection("B")}>Continue to Section B</button>
        </section>
      )}

      {section === "B" && (
        <section>
          <div className={styles.card}>
            <h2>Structured answers</h2>
            <b>Recorded: {sectionBScore}/{sectionBTotal} · Overall: {correct + sectionBScore}/{totalMarks}</b>
          </div>
          {paper.structured.map((question, questionIndex) => {
            const printedNumber = paper.mcq.length + questionIndex + 1;
            const values = responses(questionIndex, question);
            const filled = values.filter(Boolean).length;
            const result = results[questionIndex];
            const failed = !!result && result.score < question.marks;
            return (
              <article className={styles.card} key={printedNumber}>
                <span className={styles.tag}>QUESTION {printedNumber} · {question.marks} MARKS</span>
                <h2>{question.q}</h2>
                <QuestionFigure paper={paper} number={printedNumber} />
                <p>Minimum responses: {required(question)} · Completed: {filled}/{required(question)}</p>
                {values.map((value, answerIndex) => (
                  <div key={answerIndex} className={styles.answer}>
                    <label>Answer {answerIndex + 1}</label>
                    <textarea
                      rows={3}
                      value={value}
                      onChange={(event) => {
                        const updated = [...values];
                        updated[answerIndex] = event.target.value;
                        setWritten((current) => ({ ...current, [questionIndex]: updated }));
                        setResults((current) => {
                          const copy = { ...current };
                          delete copy[questionIndex];
                          return copy;
                        });
                      }}
                    />
                    {result?.feedback[answerIndex] && <small>{result.feedback[answerIndex]}</small>}
                  </div>
                ))}
                <div className={styles.actions}>
                  <button onClick={() => setWritten((current) => ({ ...current, [questionIndex]: [...values, ""] }))}>+ Add answer</button>
                  <button
                    disabled={filled < required(question)}
                    onClick={() => setResults((current) => ({ ...current, [questionIndex]: mark(values, question.scheme, question.marks) }))}
                  >Submit and mark</button>
                </div>
                {result && (
                  <div className={styles.result}>
                    <h3>Recorded marks: {result.score}/{question.marks}</h3>
                    {failed && (
                      <button onClick={() => setHelp((current) => ({ ...current, [questionIndex]: !current[questionIndex] }))}>
                        {help[questionIndex] ? "Hide" : "Show possible responses"}
                      </button>
                    )}
                  </div>
                )}
                {failed && help[questionIndex] && (
                  <div className={styles.help}><ul>{question.scheme.map((point) => <li key={point}>{point}</li>)}</ul></div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

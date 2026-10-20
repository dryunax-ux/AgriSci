"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./KjseaDigitalPaper.module.css";

type MCQ = {
  id: number;
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
};

type Structured = {
  q: string;
  marks: number;
  scheme: readonly string[];
  minAnswers?: number;
};

type Paper = {
  title: string;
  area: string;
  code: string;
  mcq: readonly MCQ[];
  structured: readonly Structured[];
};

type QuestionStatus = "active" | "answered" | "missed";

type StructuredResult = {
  score: number;
  matchedSchemeIndexes: number[];
  feedback: string[];
};

const QUESTION_SECONDS = 30;

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function importantWords(value: string) {
  const ignored = new Set([
    "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
    "is", "are", "be", "by", "from", "as", "that", "this", "it", "into",
  ]);
  return normalise(value)
    .split(" ")
    .filter((word) => word.length > 2 && !ignored.has(word));
}

function responseMatchesScheme(response: string, schemePoint: string) {
  const responseText = normalise(response);
  const schemeText = normalise(schemePoint);
  if (!responseText || !schemeText) return false;
  if (responseText.includes(schemeText) || schemeText.includes(responseText)) return true;

  const keywords = importantWords(schemePoint);
  if (!keywords.length) return false;
  const matched = keywords.filter((word) => responseText.includes(word)).length;
  return matched >= Math.max(1, Math.ceil(keywords.length * 0.55));
}

function markStructuredResponses(
  responses: string[],
  scheme: readonly string[],
  maximumMarks: number,
): StructuredResult {
  const usedSchemePoints = new Set<number>();
  const feedback: string[] = [];

  responses.forEach((response, responseIndex) => {
    if (!response.trim()) return;
    const schemeIndex = scheme.findIndex(
      (point, index) => !usedSchemePoints.has(index) && responseMatchesScheme(response, point),
    );

    if (schemeIndex >= 0) {
      usedSchemePoints.add(schemeIndex);
      feedback[responseIndex] = `Accepted: ${scheme[schemeIndex]}`;
    } else {
      feedback[responseIndex] = "No marking-scheme point matched. Teacher review is recommended.";
    }
  });

  return {
    score: Math.min(maximumMarks, usedSchemePoints.size),
    matchedSchemeIndexes: Array.from(usedSchemePoints),
    feedback,
  };
}

export default function KjseaDigitalPaper({ paper }: { paper: Paper }) {
  const [section, setSection] = useState<"A" | "B" | "scheme">("A");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [missed, setMissed] = useState<number[]>([]);
  const [status, setStatus] = useState<QuestionStatus>("active");
  const [finishedA, setFinishedA] = useState(false);
  const advanceLock = useRef(false);

  const [written, setWritten] = useState<Record<number, string[]>>({});
  const [structuredResults, setStructuredResults] = useState<Record<number, StructuredResult>>({});
  const [showScheme, setShowScheme] = useState<Record<number, boolean>>({});

  const question = paper.mcq[index];
  const correct = paper.mcq.reduce(
    (total, item, itemIndex) => total + (answers[itemIndex] === item.answer ? 1 : 0),
    0,
  );
  const incorrect = Object.keys(answers).length - correct;

  const finishOrAdvance = useCallback(() => {
    if (advanceLock.current) return;
    advanceLock.current = true;

    if (index >= paper.mcq.length - 1) {
      setFinishedA(true);
    } else {
      setIndex((current) => current + 1);
      setSeconds(QUESTION_SECONDS);
      setStatus("active");
    }

    window.setTimeout(() => {
      advanceLock.current = false;
    }, 120);
  }, [index, paper.mcq.length]);

  useEffect(() => {
    if (section !== "A" || !started || finishedA || status !== "active") return;

    if (seconds <= 0) {
      setMissed((current) => current.includes(index) ? current : [...current, index]);
      setStatus("missed");
      return;
    }

    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, section, started, finishedA, status, index]);

  useEffect(() => {
    if (status !== "missed" || finishedA) return;
    const autoAdvance = window.setTimeout(finishOrAdvance, 1200);
    return () => window.clearTimeout(autoAdvance);
  }, [status, finishedA, finishOrAdvance]);

  function selectAnswer(choice: number) {
    if (status !== "active") return;
    setAnswers((current) => ({ ...current, [index]: choice }));
    setStatus("answered");
  }

  function resetSectionA() {
    advanceLock.current = false;
    setStarted(false);
    setIndex(0);
    setSeconds(QUESTION_SECONDS);
    setAnswers({});
    setMissed([]);
    setStatus("active");
    setFinishedA(false);
  }

  function requiredResponses(item: Structured) {
    return Math.max(1, item.minAnswers ?? Math.min(item.marks, item.scheme.length));
  }

  function responsesFor(questionIndex: number, item: Structured) {
    const required = requiredResponses(item);
    return written[questionIndex] ?? Array.from({ length: required }, () => "");
  }

  function updateResponse(questionIndex: number, item: Structured, responseIndex: number, value: string) {
    const responses = [...responsesFor(questionIndex, item)];
    responses[responseIndex] = value;
    setWritten((current) => ({ ...current, [questionIndex]: responses }));
    setStructuredResults((current) => {
      const copy = { ...current };
      delete copy[questionIndex];
      return copy;
    });
  }

  function addResponse(questionIndex: number, item: Structured) {
    const responses = [...responsesFor(questionIndex, item), ""];
    setWritten((current) => ({ ...current, [questionIndex]: responses }));
  }

  function markStructured(questionIndex: number, item: Structured) {
    const responses = responsesFor(questionIndex, item);
    const completed = responses.filter((response) => response.trim()).length;
    const minimum = requiredResponses(item);

    if (completed < minimum) return;

    const result = markStructuredResponses(responses, item.scheme, item.marks);
    setStructuredResults((current) => ({ ...current, [questionIndex]: result }));
  }

  const sectionBScore = useMemo(
    () => Object.values(structuredResults).reduce((total, result) => total + result.score, 0),
    [structuredResults],
  );
  const sectionBTotal = paper.structured.reduce((total, item) => total + item.marks, 0);
  const overallScore = correct + sectionBScore;
  const overallTotal = paper.mcq.length + sectionBTotal;

  return (
    <main className={styles.wrap}>
      <p><a href="/kjsea">← KJSEA Sample Paper Bank</a></p>

      <header className={styles.head}>
        <div>
          <span className={styles.tag}>DIGITAL INTERACTIVE PAPER</span>
          <h1>{paper.title}</h1>
          <p>{paper.area} · Paper {paper.code} · {overallTotal} marks</p>
        </div>
        {section === "A" && started && !finishedA && (
          <div className={`${styles.timer} ${seconds <= 5 ? styles.danger : seconds <= 10 ? styles.warn : ""}`}>
            {seconds}s
          </div>
        )}
      </header>

      <nav className={styles.sectionNav}>
        <button className={section === "A" ? styles.active : ""} onClick={() => setSection("A")}>Section A · Timed</button>
        <button className={section === "B" ? styles.active : ""} onClick={() => setSection("B")}>Section B · Answer Space</button>
        <button className={section === "scheme" ? styles.active : ""} onClick={() => setSection("scheme")}>Teacher Marking Scheme</button>
      </nav>

      {section === "A" && !started && (
        <section className={styles.card}>
          <h2>Section A: {paper.mcq.length} marks</h2>
          <ul>
            <li>{paper.mcq.length} multiple-choice questions</li>
            <li>{QUESTION_SECONDS} seconds for each question</li>
            <li>A timed-out question is marked missed</li>
            <li>The next question opens automatically after timeout</li>
          </ul>
          <div className={styles.actions}><button onClick={() => setStarted(true)}>Start timed Section A</button></div>
        </section>
      )}

      {section === "A" && started && !finishedA && question && (
        <>
          <div className={styles.progress}><span style={{ width: `${((index + 1) / paper.mcq.length) * 100}%` }} /></div>
          <div className={styles.stats}>
            <div><b>{index + 1}/{paper.mcq.length}</b><span>question</span></div>
            <div><b>{correct}</b><span>correct</span></div>
            <div><b>{incorrect}</b><span>incorrect</span></div>
            <div><b>{missed.length}</b><span>missed</span></div>
          </div>

          <article className={styles.card}>
            <span className={styles.tag}>QUESTION {index + 1}</span>
            <h2>{question.prompt}</h2>
            <div className={styles.options}>
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`${styles.option} ${answers[index] === optionIndex ? styles.chosen : ""} ${status === "answered" ? optionIndex === question.answer ? styles.good : answers[index] === optionIndex ? styles.bad : "" : ""}`}
                >
                  <input
                    type="radio"
                    disabled={status !== "active"}
                    checked={answers[index] === optionIndex}
                    onChange={() => selectAnswer(optionIndex)}
                  />
                  <b>{String.fromCharCode(65 + optionIndex)}.</b>
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {status === "answered" && (
              <p className={styles.feedback}>
                {answers[index] === question.answer ? "Correct. " : "Incorrect. "}
                {question.explanation}
              </p>
            )}

            {status === "missed" && (
              <p className={styles.missed}>Time expired. This question is marked missed. The next question opens automatically.</p>
            )}

            <div className={styles.actions}>
              <span>{QUESTION_SECONDS} seconds per question</span>
              {(status === "answered" || status === "missed") && (
                <button onClick={finishOrAdvance}>
                  {index === paper.mcq.length - 1 ? "Finish Section A" : "Next question →"}
                </button>
              )}
            </div>
          </article>
        </>
      )}

      {section === "A" && finishedA && (
        <section className={styles.result}>
          <span className={styles.tag}>SECTION A COMPLETE</span>
          <h2>Section A score: {correct}/{paper.mcq.length}</h2>
          <p>Incorrect: {incorrect} · Missed: {missed.length}</p>
          <div className={styles.actions}>
            <button onClick={resetSectionA}>Retry Section A</button>
            <button onClick={() => setSection("B")}>Continue to Section B →</button>
          </div>
        </section>
      )}

      {section === "B" && (
        <section>
          <div className={styles.card}>
            <h2>Section B: Digital answer spaces</h2>
            <p>Enter separate responses for every requested point. A question can only be marked after the minimum number of answers has been entered.</p>
            <div className={styles.scoreBar}>
              <b>Recorded Section B marks: {sectionBScore}/{sectionBTotal}</b>
              <span>Overall paper score: {overallScore}/{overallTotal}</span>
            </div>
          </div>

          {paper.structured.map((item, questionIndex) => {
            const responses = responsesFor(questionIndex, item);
            const minimum = requiredResponses(item);
            const completed = responses.filter((response) => response.trim()).length;
            const result = structuredResults[questionIndex];

            return (
              <article className={styles.card} key={questionIndex}>
                <span className={styles.tag}>QUESTION {paper.mcq.length + questionIndex + 1} · {item.marks} MARKS</span>
                <h2>{item.q}</h2>
                <p className={styles.minimumNotice}>Provide at least {minimum} separate answer{minimum === 1 ? "" : "s"}. Completed: {completed}/{minimum}</p>

                <div className={styles.responseList}>
                  {responses.map((response, responseIndex) => (
                    <div className={styles.responseRow} key={responseIndex}>
                      <label htmlFor={`response-${questionIndex}-${responseIndex}`}>Answer {responseIndex + 1}</label>
                      <textarea
                        id={`response-${questionIndex}-${responseIndex}`}
                        className={styles.textarea}
                        rows={3}
                        value={response}
                        onChange={(event) => updateResponse(questionIndex, item, responseIndex, event.target.value)}
                        placeholder={`Enter marking point ${responseIndex + 1}...`}
                      />
                      {result?.feedback[responseIndex] && (
                        <small className={result.feedback[responseIndex].startsWith("Accepted") ? styles.accepted : styles.review}>
                          {result.feedback[responseIndex]}
                        </small>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.actions}>
                  <button onClick={() => addResponse(questionIndex, item)}>+ Add another answer</button>
                  <button disabled={completed < minimum} onClick={() => markStructured(questionIndex, item)}>
                    Mark against scheme
                  </button>
                </div>

                {completed < minimum && (
                  <p className={styles.missed}>Add {minimum - completed} more answer{minimum - completed === 1 ? "" : "s"} before marking.</p>
                )}

                {result && (
                  <div className={styles.structuredResult}>
                    <h3>Recorded marks: {result.score}/{item.marks}</h3>
                    <p>Automatic marking matched {result.matchedSchemeIndexes.length} unique marking-scheme point{result.matchedSchemeIndexes.length === 1 ? "" : "s"}. Teacher review can be used for equivalent wording.</p>
                    <button onClick={() => setShowScheme((current) => ({ ...current, [questionIndex]: !current[questionIndex] }))}>
                      {showScheme[questionIndex] ? "Hide marking scheme" : "Teacher: show marking scheme"}
                    </button>
                  </div>
                )}

                {showScheme[questionIndex] && (
                  <div className={styles.scheme}>
                    <b>Marking scheme: award one mark per valid point, up to {item.marks} mark{item.marks === 1 ? "" : "s"}.</b>
                    <ol>{item.scheme.map((point) => <li key={point}>{point}</li>)}</ol>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {section === "scheme" && (
        <section>
          <div className={styles.card}>
            <h2>Teacher marking scheme</h2>
            <p>Accept equivalent correct wording. Automatic scores are recorded against each question and the total paper marks.</p>
            <div className={styles.scoreBar}>
              <b>Section A: {correct}/{paper.mcq.length}</b>
              <b>Section B: {sectionBScore}/{sectionBTotal}</b>
              <b>Total: {overallScore}/{overallTotal}</b>
            </div>
          </div>
          {paper.structured.map((item, questionIndex) => (
            <article className={styles.card} key={questionIndex}>
              <span className={styles.tag}>QUESTION {paper.mcq.length + questionIndex + 1} · {item.marks} MARKS</span>
              <h3>{item.q}</h3>
              <ol>{item.scheme.map((point) => <li key={point}>{point} <b>(1 mark)</b></li>)}</ol>
              <p><b>Recorded:</b> {structuredResults[questionIndex]?.score ?? 0}/{item.marks}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

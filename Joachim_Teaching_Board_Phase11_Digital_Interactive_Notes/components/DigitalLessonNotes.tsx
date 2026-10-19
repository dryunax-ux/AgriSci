"use client";
import {useMemo,useState} from "react";
import {buildDigitalNote} from "../lib/digitalNoteEngine";
import styles from "./DigitalLessonNotes.module.css";

type Props={title:string;terms:readonly string[];facts:readonly string[];note?:string};
type Tab="concept"|"procedure"|"safety"|"misconceptions"|"summary"|"review";
export default function DigitalLessonNotes({title,terms,facts,note}:Props){
 const data=useMemo(()=>buildDigitalNote(title,terms,facts,note),[title,terms,facts,note]);const [tab,setTab]=useState<Tab>("concept"),[revealed,setRevealed]=useState(false);
 const tabs:[Tab,string][]=[["concept","Core notes"],["procedure","Process"],["safety","Safety"],["misconceptions","Misconceptions"],["summary","Summary"],["review","Oral review"]];
 return <section className={styles.notes}><div className={styles.head}><div><span className={styles.badge}>DIGITAL INTERACTIVE NOTES</span><h2>{title}</h2><p>{data.overview}</p></div><div className={styles.controls}><button onClick={()=>setRevealed(!revealed)}>{revealed?"Hide key ideas":"Reveal key ideas"}</button><button onClick={()=>window.print()}>Print notes</button></div></div><div className={styles.terms}>{terms.map(t=><span key={t}>{t}</span>)}</div><nav className={styles.tabs}>{tabs.map(([id,label])=><button key={id} className={`${styles.tab} ${tab===id?styles.active:""}`} onClick={()=>setTab(id)}>{label}</button>)}</nav><div className={styles.content}>
 {tab==="concept"&&<><h3>Main explanation</h3><p>{data.diagramPrompt}</p>{revealed?<ul>{data.explanations.map(x=><li key={x}>{x}</li>)}</ul>:<p className={styles.question}>Ask learners to predict three important ideas, then select “Reveal key ideas”.</p>}</>}
 {tab==="procedure"&&<><h3>Sequence and application</h3><ol>{data.procedure.map(x=><li key={x}>{x}</li>)}</ol></>}
 {tab==="safety"&&<><h3>Safety, hygiene and responsible practice</h3><ul>{data.safety.map(x=><li key={x}>{x}</li>)}</ul></>}
 {tab==="misconceptions"&&<div className={styles.cardGrid}>{data.misconceptions.map(x=><article className={styles.mini} key={x.claim}><b className={styles.claim}>Misconception</b><p>{x.claim}</p><b className={styles.correction}>Correction</b><p>{x.correction}</p></article>)}</div>}
 {tab==="summary"&&<><h3>Five-point summary</h3><ol className={styles.summary}>{data.summary.map(x=><li key={x}>{x}</li>)}</ol></>}
 {tab==="review"&&<><h3>Whole-class oral review</h3>{data.oralQuestions.map((x,i)=><p className={styles.question} key={x}><b>{i+1}.</b> {x}</p>)}</>}
 </div><div className={styles.printOnly}><h3>All notes</h3><ul>{data.explanations.map(x=><li key={x}>{x}</li>)}</ul><ol>{data.procedure.map(x=><li key={x}>{x}</li>)}</ol></div></section>
}

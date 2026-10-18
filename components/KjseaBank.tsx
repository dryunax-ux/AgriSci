import {kjseaPapers} from "../lib/kjseaPapers";
import styles from "./KjseaBank.module.css";

export default function KjseaBank(){
 return <main className={styles.wrap}>
  <header className={styles.hero}>
   <span className={styles.tag}>SEPARATE DIGITAL ASSESSMENT BANK</span>
   <h1>KJSEA Digital Sample Papers</h1>
   <p>Select a paper to open its digital assessment. Section A is timed at 30 seconds per question, while Section B provides digital answer spaces and a teacher marking scheme.</p>
  </header>
  <div className={styles.stats}>
   <div><b>{kjseaPapers.length}</b><span>digital papers</span></div>
   <div><b>30 sec</b><span>per Section A question</span></div>
   <div><b>70</b><span>marks per paper</span></div>
  </div>
  <div className={styles.grid}>
   {kjseaPapers.map(p=><a className={styles.card} href={`/kjsea/${p.id}/digital`} key={p.id}>
    <span className={styles.tag}>DIGITAL INTERACTIVE PAPER</span>
    <h2>{p.title}</h2>
    <p>{p.description}</p>
    <div className={styles.meta}>
     <span>Paper {p.paperCode}</span><span>Section A: 30 marks</span><span>Section B: 40 marks</span><span>Total: {p.marks} marks</span>
    </div>
    <div className={styles.topics}>{p.topics.slice(0,5).map(t=><span key={t}>{t}</span>)}</div>
    <b className={styles.open}>Start digital paper →</b>
   </a>)}
  </div>
  <section className={styles.section}>
   <h2>Assessment modes</h2>
   <ul><li>Section A: 30 timed A–D questions</li><li>30 seconds for every question</li><li>Automatic missed-question status and movement</li><li>Section B: digital answer spaces</li><li>Teacher marking scheme and marking points</li></ul>
  </section>
 </main>
}

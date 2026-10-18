"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HamburgerMenu.module.css";

const learningItems = [
  { href: "/", icon: "🏠", title: "Home", description: "Grades 8–9 course dashboard" },
  { href: "/notes", icon: "📘", title: "Lesson Notes", description: "Notes by grade, subject, strand and lesson", badge: "540 lessons" },
];

const assessmentItems = [
  { href: "/questions", icon: "✅", title: "Curriculum Question Banks", description: "100 timed MCQs for each curriculum strand", badge: "20 seconds each" },
  { href: "/kjsea", icon: "📝", title: "KJSEA Sample Paper Bank", description: "Separate sample papers, marking schemes and timed papers", badge: "Separate bank" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menuLink = (item: typeof learningItems[number]) => (
    <a key={item.href} className={styles.link} href={item.href} onClick={() => setOpen(false)}>
      <span className={styles.icon}>{item.icon}</span>
      <span>
        <b>{item.title}</b>
        <small>{item.description}</small>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
      </span>
      <span className={styles.arrow}>→</span>
    </a>
  );

  return <>
    <button className={`${styles.menuButton} ${open ? styles.open : ""}`} onClick={() => setOpen(true)} aria-label="Open course menu" aria-expanded={open} aria-controls="course-menu-drawer">
      <span className={styles.lines} aria-hidden="true"><span/><span/><span/></span>
    </button>
    {open && <button className={styles.backdrop} aria-label="Close menu" onClick={() => setOpen(false)}/>}
    <aside id="course-menu-drawer" className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`} aria-hidden={!open}>
      <div className={styles.drawerHeader}><div><b>JSS AgriScience Menu</b><small>Learning and assessment centres</small></div><button ref={closeRef} className={styles.closeButton} onClick={() => setOpen(false)} aria-label="Close course menu">×</button></div>

      <p className={styles.sectionLabel}>Learning</p>
      <nav className={styles.linkList}>{learningItems.map(menuLink)}</nav>

      <p className={styles.sectionLabel}>Assessment Banks</p>
      <nav className={styles.linkList}>{assessmentItems.map(menuLink)}</nav>

      <p className={styles.sectionLabel}>Quick Course Access</p>
      <div className={styles.gradeGrid}>
        <a className={styles.gradeLink} href="/course/8/agriculture" onClick={() => setOpen(false)}><span>🌾</span><b>Grade 8<br/>Agriculture</b></a>
        <a className={styles.gradeLink} href="/course/8/integrated-science" onClick={() => setOpen(false)}><span>🔬</span><b>Grade 8<br/>Science</b></a>
        <a className={styles.gradeLink} href="/course/9/agriculture" onClick={() => setOpen(false)}><span>🌱</span><b>Grade 9<br/>Agriculture</b></a>
        <a className={styles.gradeLink} href="/course/9/integrated-science" onClick={() => setOpen(false)}><span>⚛️</span><b>Grade 9<br/>Science</b></a>
      </div>

      <div className={styles.footerNote}><b>Two separate banks:</b><br/>Curriculum Question Banks use the existing 100-question strand assessments. KJSEA Sample Paper Bank contains only papers created from uploaded KJSEA samples.</div>
    </aside>
  </>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HamburgerMenu.module.css";

const mainItems = [
  {
    href: "/",
    icon: "🏠",
    title: "Home",
    description: "Grades 8–9 course dashboard",
  },
  {
    href: "/notes",
    icon: "📘",
    title: "Lesson Notes",
    description: "Select notes by grade, subject, strand and lesson",
    badge: "Notes centre",
  },
  {
    href: "/questions",
    icon: "✅",
    title: "Question Banks",
    description: "Select 100 MCQs by grade, subject and strand",
    badge: "1,400 questions",
  },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        className={`${styles.menuButton} ${open ? styles.open : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open course menu"
        aria-expanded={open}
        aria-controls="course-menu-drawer"
      >
        <span className={styles.lines} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <button
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="course-menu-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.drawerHeader}>
          <div>
            <b>JSS AgriScience Menu</b>
            <small>Lessons, notes and assessment</small>
          </div>
          <button
            ref={closeRef}
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Close course menu"
          >
            ×
          </button>
        </div>

        <p className={styles.sectionLabel}>Main menu</p>
        <nav className={styles.linkList}>
          {mainItems.map((item) => (
            <a key={item.href} className={styles.link} href={item.href} onClick={() => setOpen(false)}>
              <span className={styles.icon}>{item.icon}</span>
              <span>
                <b>{item.title}</b>
                <small>{item.description}</small>
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </span>
              <span className={styles.arrow}>→</span>
            </a>
          ))}
        </nav>

        <p className={styles.sectionLabel}>Quick course access</p>
        <div className={styles.gradeGrid}>
          <a className={styles.gradeLink} href="/course/8/agriculture" onClick={() => setOpen(false)}>
            <span>🌾</span><b>Grade 8<br />Agriculture</b>
          </a>
          <a className={styles.gradeLink} href="/course/8/integrated-science" onClick={() => setOpen(false)}>
            <span>🔬</span><b>Grade 8<br />Science</b>
          </a>
          <a className={styles.gradeLink} href="/course/9/agriculture" onClick={() => setOpen(false)}>
            <span>🌱</span><b>Grade 9<br />Agriculture</b>
          </a>
          <a className={styles.gradeLink} href="/course/9/integrated-science" onClick={() => setOpen(false)}>
            <span>⚛️</span><b>Grade 9<br />Science</b>
          </a>
        </div>

        <p className={styles.sectionLabel}>Teacher tools</p>
        <nav className={styles.linkList}>
          <a className={styles.link} href="/questions" onClick={() => setOpen(false)}>
            <span className={styles.icon}>🏆</span>
            <span><b>Strand Assessment</b><small>Open a 100-question strand bank</small></span>
            <span className={styles.arrow}>→</span>
          </a>
          <a className={styles.link} href="/notes" onClick={() => setOpen(false)}>
            <span className={styles.icon}>🖥️</span>
            <span><b>Presentation Notes</b><small>Lesson notes will be added here phase by phase</small></span>
            <span className={styles.arrow}>→</span>
          </a>
        </nav>

        <div className={styles.footerNote}>
          The three-line button remains visible in the top bar. Press <b>Esc</b>, tap ×, or tap outside the drawer to close it.
        </div>
      </aside>
    </>
  );
}

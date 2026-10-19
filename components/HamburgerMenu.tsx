"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HamburgerMenu.module.css";

const learningItems = [
  {
    href: "/",
    icon: "🏠",
    title: "Home",
    description: "Joachim Teaching Board dashboard",
  },
  {
    href: "/notes",
    icon: "📘",
    title: "Lesson Notes",
    description: "Digital notes by grade, subject, strand and lesson",
  },
];

const assessmentItems = [
  {
    href: "/questions",
    icon: "✅",
    title: "Curriculum Question Banks",
    description: "Timed strand and lesson assessments",
  },
  {
    href: "/kjsea",
    icon: "📝",
    title: "KJSEA Sample Paper Bank",
    description: "Digital papers, answer spaces and marking schemes",
  },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      closeButtonRef.current?.focus();
    }

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className={styles.hamburgerRoot}>
      <button
        className={`${styles.menuButton} ${open ? styles.open : ""}`}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Joachim Teaching Board menu"
        aria-expanded={open}
        aria-controls="joachim-menu-drawer"
      >
        <span className={styles.lines} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside
        id="joachim-menu-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.drawerHeader}>
          <div>
            <b>Joachim Teaching Board</b>
            <small>Learning and assessment centres</small>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="Close Joachim Teaching Board menu"
          >
            ×
          </button>
        </div>

        <p className={styles.sectionLabel}>Learning</p>
        <nav className={styles.linkList} aria-label="Learning links">
          {learningItems.map((item) => (
            <a key={item.href} className={styles.link} href={item.href} onClick={closeMenu}>
              <span className={styles.icon}>{item.icon}</span>
              <span>
                <b>{item.title}</b>
                <small>{item.description}</small>
              </span>
              <span className={styles.arrow}>→</span>
            </a>
          ))}
        </nav>

        <p className={styles.sectionLabel}>Assessment banks</p>
        <nav className={styles.linkList} aria-label="Assessment links">
          {assessmentItems.map((item) => (
            <a key={item.href} className={styles.link} href={item.href} onClick={closeMenu}>
              <span className={styles.icon}>{item.icon}</span>
              <span>
                <b>{item.title}</b>
                <small>{item.description}</small>
              </span>
              <span className={styles.arrow}>→</span>
            </a>
          ))}
        </nav>

        <p className={styles.sectionLabel}>Quick course access</p>
        <div className={styles.gradeGrid}>
          <a className={styles.gradeLink} href="/course/8/agriculture" onClick={closeMenu}>
            <span>🌾</span><b>Grade 8<br />Agriculture</b>
          </a>
          <a className={styles.gradeLink} href="/course/8/integrated-science" onClick={closeMenu}>
            <span>🔬</span><b>Grade 8<br />Science</b>
          </a>
          <a className={styles.gradeLink} href="/course/9/agriculture" onClick={closeMenu}>
            <span>🌱</span><b>Grade 9<br />Agriculture</b>
          </a>
          <a className={styles.gradeLink} href="/course/9/integrated-science" onClick={closeMenu}>
            <span>⚛️</span><b>Grade 9<br />Science</b>
          </a>
        </div>
      </aside>
    </div>
  );
}

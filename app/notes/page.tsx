const pathways = [
  { href: "/course/8/agriculture", icon: "🌾", grade: "Grade 8", subject: "Agriculture" },
  { href: "/course/8/integrated-science", icon: "🔬", grade: "Grade 8", subject: "Integrated Science" },
  { href: "/course/9/agriculture", icon: "🌱", grade: "Grade 9", subject: "Agriculture" },
  { href: "/course/9/integrated-science", icon: "⚛️", grade: "Grade 9", subject: "Integrated Science" },
];

export const metadata = { title: "Lesson Notes | JSS AgriScience" };

export default function NotesPage() {
  return (
    <main>
      <section className="hero">
        <span className="kicker">LESSON NOTES CENTRE</span>
        <h1>Notes by lesson</h1>
        <p>
          This menu area is reserved for concise learner notes, illustrated explanations,
          practical procedures, vocabulary and teacher presentation notes for each lesson.
        </p>
      </section>

      <section className="panel phasebadge">
        <h2>Notes structure</h2>
        <p>
          Choose a pathway below, then select a strand, sub-strand and lesson. Detailed
          notes will be added without crowding the main dashboard.
        </p>
      </section>

      <div className="subjectGrid">
        {pathways.map((item) => (
          <a className="subject" href={item.href} key={`${item.grade}-${item.subject}`}>
            <i>{item.icon}</i>
            <span className="kicker">{item.grade}</span>
            <h3>{item.subject}</h3>
            <p>Open lessons and current learning materials</p>
            <strong>→</strong>
          </a>
        ))}
      </div>
    </main>
  );
}

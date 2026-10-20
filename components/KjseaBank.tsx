import Link from "next/link";
import { kjseaPapers } from "../lib/kjseaPapers";

export default function KjseaBank() {
  return (
    <section aria-labelledby="kjsea-heading" style={{ padding: "1rem 0" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: 0, color: "#2563eb", fontWeight: 800, letterSpacing: ".08em" }}>
          KJSEA SAMPLE PAPER BANK
        </p>
        <h2 id="kjsea-heading" style={{ margin: ".35rem 0" }}>
          Agriculture and Integrated Science
        </h2>
        <p style={{ margin: 0, color: "#475569" }}>
          Independently transcribed digital papers for Grades 7, 8 and 9.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        {kjseaPapers.map((paper) => (
          <article
            key={paper.slug}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "16px",
              padding: "1rem",
              background: "#ffffff",
              boxShadow: "0 8px 24px rgba(15, 23, 42, .06)",
            }}
          >
            <p style={{ margin: 0, color: "#2563eb", fontWeight: 800 }}>{paper.code}</p>
            <h3 style={{ margin: ".4rem 0" }}>{paper.title}</h3>
            <p style={{ margin: ".35rem 0", color: "#475569" }}>{paper.area}</p>
            <p style={{ margin: ".65rem 0 1rem", color: "#334155" }}>
              {paper.mcq.length} multiple-choice questions and {paper.structured.length} structured questions
            </p>
            <Link
              href={`/kjsea/paper/${paper.slug}`}
              style={{
                display: "inline-block",
                padding: ".7rem 1rem",
                borderRadius: "10px",
                background: "#2563eb",
                color: "white",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Open paper
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

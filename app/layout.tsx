import "./globals.css";
import HamburgerMenu from "../components/HamburgerMenu";

export const metadata = {
  title: "Joachim Teaching Board",
  description: "Interactive Agriculture and Integrated Science teaching board for Grades 8-9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
          <header className="top">
            <a className="logo" href="/" aria-label="Joachim Teaching Board home">JTB</a>
            <div className="brandText">
              <b>Joachim Teaching Board</b>
              <small>Interactive Grades 8-9</small>
            </div>
            <div className="menuSlot">
              <HamburgerMenu />
            </div>
          </header>

          <div style={{ flex: "1 0 auto", width: "100%" }}>{children}</div>

          <footer
            aria-label="Copyright"
            style={{
              width: "100%",
              minHeight: "78px",
              marginTop: "auto",
              padding: "20px 16px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "#aab5c8",
              background: "#090f1b",
              borderTop: "1px solid #2f3b50",
              position: "relative",
              left: 0,
              right: 0,
              float: "none",
              transform: "none",
            }}
          >
            <span
              style={{
                display: "block",
                width: "100%",
                margin: 0,
                padding: 0,
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: 700,
                lineHeight: 1.4,
                letterSpacing: "0.02em",
              }}
            >
              2026 JOACHIM TEACHING BOARD. All rights reserved.
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}

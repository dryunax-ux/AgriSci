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
        <div className="siteShell">
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

          <div className="siteContent">{children}</div>

          <footer id="joachim-global-footer" aria-label="Copyright">
            <div className="joachimCopyright">
              2026 JOACHIM TEACHING BOARD. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

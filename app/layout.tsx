import "./globals.css";
import HamburgerMenu from "../components/HamburgerMenu";

export const metadata = {
  title: "JSS AgriScience 8–9",
  description: "Interactive Agriculture and Integrated Science course",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="siteShell">
          <header className="top">
            <a className="logo" href="/" aria-label="JSS AgriScience home">JA</a>
            <div className="brandText">
              <b>JSS AgriScience</b>
              <small>Interactive Grades 8–9</small>
            </div>
            <div className="menuSlot">
              <HamburgerMenu />
            </div>
          </header>

          <div className="siteContent">{children}</div>

          <footer className="siteFooter">
            <p>2026 JOACHIM. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

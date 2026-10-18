import "./globals.css";
export const metadata={title:"JSS AgriScience 8–9",description:"Interactive Agriculture and Integrated Science course"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="top"><a className="logo" href="/">JA</a><div><b>JSS AgriScience</b><small>Interactive Grades 8–9</small></div><nav className="mainnav"><a href="/">Home</a><a href="/questions">Question Banks</a></nav></header>{children}<footer>Curriculum-aligned interactive learning app</footer></body></html>}

export const metadata = { title: "KJSEA Sample Paper Bank | JSS AgriScience" };

export default function KjseaPage() {
  return <main>
    <section className="hero">
      <span className="kicker">SEPARATE ASSESSMENT BANK</span>
      <h1>KJSEA Sample Paper Bank</h1>
      <p>This area is completely separate from the curriculum strand question banks. Only uploaded KJSEA sample papers and new equivalent practice papers will appear here.</p>
    </section>

    <div className="metrics">
      <div><b>0</b><span>sample papers added</span></div>
      <div><b>2</b><span>learning areas planned</span></div>
      <div><b>Separate</b><span>from strand banks</span></div>
    </div>

    <section className="panel phasebadge">
      <h2>Bank currently awaiting papers</h2>
      <p>Upload the first KJSEA sample paper in the conversation. The paper will be added here with its own title, year or source label, learning area, duration, marks and marking scheme.</p>
    </section>

    <div className="subjectGrid">
      <section className="subject">
        <i>🌾</i><span className="kicker">KJSEA SAMPLE PAPERS</span><h3>Agriculture</h3>
        <p>Uploaded Agriculture papers, marking schemes, timed attempts and topic analysis will appear here.</p>
      </section>
      <section className="subject">
        <i>🔬</i><span className="kicker">KJSEA SAMPLE PAPERS</span><h3>Integrated Science</h3>
        <p>Uploaded Integrated Science papers, marking schemes, timed attempts and topic analysis will appear here.</p>
      </section>
    </div>

    <section className="panel">
      <h2>What each uploaded paper will receive</h2>
      <ul>
        <li>A separate paper card inside this bank</li>
        <li>Original paper details and instructions</li>
        <li>Timed full-paper mode</li>
        <li>Automatic marking for objective questions</li>
        <li>Teacher marking guide for structured questions</li>
        <li>Strand and sub-strand performance analysis</li>
        <li>New equivalent revision questions</li>
      </ul>
    </section>

    <section className="panel">
      <h2>Go to the other assessment bank</h2>
      <p>The curriculum strand questions remain at <a href="/questions"><b>Curriculum Question Banks →</b></a>. Those 100-question timed banks will not be mixed with KJSEA papers.</p>
    </section>
  </main>;
}

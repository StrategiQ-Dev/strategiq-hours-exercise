function IntroStep({ hasSavedData, onBegin, onResume, logoPath }) {
  return (
    <section className="intro">
      <img src={logoPath} alt="StrategiQ" className="intro__floating-logo" />
      <p className="eyebrow">Career Planning Framework</p>
      <h1 className="intro__title">
        The Hours
        <br />
        Exercise
      </h1>
      <p className="intro__copy">
        A structured six-step process to clarify your career goal, understand the time you truly have available, and
        build a deliberate plan for the skills that will get you there.
      </p>
      <div className="actions">
        <button className="btn btn--primary" onClick={onBegin}>
          Begin the exercise -&gt;
        </button>
        {hasSavedData && (
          <button className="btn btn--secondary" onClick={onResume}>
            Resume where I left off
          </button>
        )}
      </div>
      <div className="intro__meta">
        {["6 steps", "~20 minutes", "Saves automatically"].map((item) => (
          <div key={item} className="intro__meta-card">
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IntroStep;

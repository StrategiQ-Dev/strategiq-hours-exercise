import { getSkillColor, sortSkillsByGapFirst } from "../helpers";

function EvidencePlanStep({ state, setState, onBack, onNext }) {
  const sortedSkills = sortSkillsByGapFirst(state.skills, state.skillLabels);

  return (
    <section>
      <h2 className="section-title">Evidence Plan</h2>
      <p className="section-subtitle">
        For each skill, note the specific evidence you will build. Be concrete - what will you do, with whom, by
        when?
      </p>

      {sortedSkills.map(({ skill, index, score }) => {
        const isGap = score < 6;
        const color = getSkillColor(score);
        return (
          <div key={skill} className="card card--evidence">
            <div className="evidence-head">
              <div>
                <div className="evidence-title">{skill}</div>
                <div className={`evidence-subtitle ${isGap ? "evidence-subtitle--gap" : "evidence-subtitle--ok"}`}>
                  {score}/10 - {isGap ? "Gap - needs building" : "On track"}
                </div>
              </div>

              <div className="evidence-pips">
                {Array.from({ length: 10 }, (_, pip) => (
                  <div
                    key={pip}
                    className="evidence-pips__item"
                    style={{ background: pip < score ? color : "var(--he-border)" }}
                  />
                ))}
              </div>
            </div>

            <textarea
              className={`input textarea ${isGap ? "textarea--gap" : "textarea--ok"}`}
              value={state.evidence[index]}
              onChange={(event) => {
                const value = event.target.value;
                setState((prev) => {
                  const nextEvidence = [...prev.evidence];
                  nextEvidence[index] = value;
                  return { ...prev, evidence: nextEvidence };
                });
              }}
              placeholder={
                isGap
                  ? "What specific work, projects, or actions will build this skill?"
                  : "What will you do to maintain and demonstrate this strength?"
              }
            />
          </div>
        );
      })}

      <div className="card card--dark card--quote">"Competence gets you considered. Warmth gets you chosen."</div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={onBack}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={onNext}>
          View Results -&gt;
        </button>
      </div>
    </section>
  );
}

export default EvidencePlanStep;

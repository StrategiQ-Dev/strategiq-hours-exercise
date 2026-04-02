import { getSkillColor } from "../helpers";

function SkillsAssessmentStep({ state, metrics, setState, onBack, onNext }) {
  const skills = state.skillLabels ?? [];

  return (
    <section>
      <h2 className="section-title">Skills Assessment</h2>
      <p className="section-subtitle">Rate yourself honestly from 0 to 10. The target for each skill is 6.</p>

      <div className="card card--skills">
        {skills.map((skill, index) => {
          const score = state.skills[index];
          const color = getSkillColor(score);

          return (
            <div key={skill} className="skill-rating">
              <div className="skill-rating__header">
                <span>{skill}</span>
                <span style={{ color }}>{score}/10</span>
              </div>

              <div className="skill-rating__pips">
                {Array.from({ length: 10 }, (_, pip) => {
                  const number = pip + 1;
                  return (
                    <button
                      key={number}
                      className="skill-rating__pip"
                      onClick={() =>
                        setState((prev) => {
                          const nextSkills = [...prev.skills];
                          nextSkills[index] = number === prev.skills[index] ? Math.max(0, number - 1) : number;
                          return { ...prev, skills: nextSkills };
                        })
                      }
                      title={`${number}/10`}
                      style={{ background: number <= score ? color : "var(--he-border)" }}
                    />
                  );
                })}
              </div>

              <div className="skill-rating__axis">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`status-card ${metrics.gaps > 0 ? "status-card--warning" : "status-card--success"}`}>
        {metrics.gaps > 0
          ? `${metrics.gaps} skill gap${metrics.gaps !== 1 ? "s" : ""} identified (below 6/10)`
          : "All skills on target - excellent foundation"}
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={onBack}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={onNext}>
          Next: Evidence Plan -&gt;
        </button>
      </div>
    </section>
  );
}

export default SkillsAssessmentStep;

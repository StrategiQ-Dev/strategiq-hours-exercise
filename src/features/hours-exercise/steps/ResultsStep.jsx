import { formatDate } from "../../../utils/date";
import { getIndexedSkills, getSkillColor } from "../helpers";

function ResultsStep({ state, metrics, onBack, onStartAgain }) {
  const indexedSkills = getIndexedSkills(state.skills, state.skillLabels);

  return (
    <section>
      <div className="card card--dark card--centered card--plan">
        <p className="eyebrow eyebrow--light">Career Plan</p>
        <h1 className="plan-title">{state.goal}</h1>
        <p className="plan-name">{state.name}</p>
        <p className="plan-date">Target: {formatDate(state.targetDate)}</p>
      </div>

      <div className="stat-grid-4">
        {[
          { label: "Real Hours", value: metrics.realHours.toLocaleString() },
          { label: "Days Remaining", value: metrics.days.toLocaleString() },
          { label: "Skill Gaps", value: metrics.gaps },
          { label: "Avg Score", value: `${metrics.avgScore}/10` },
        ].map((item) => (
          <div key={item.label} className="result-stat">
            <div className="result-stat__value">{item.value}</div>
            <div className="result-stat__label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="block-title">Skills Overview</h3>
        {indexedSkills.map(({ skill, score }) => {
          const percentage = (score / 10) * 100;
          const color = getSkillColor(score);
          return (
            <div key={skill} className="overview-row">
              <div className="overview-row__head">
                <span>{skill}</span>
                <span style={{ color }}>{score}/10</span>
              </div>
              <div className="overview-row__bar">
                <div className="overview-row__fill" style={{ width: `${percentage}%`, background: color }} />
                <div className="overview-row__target" />
              </div>
            </div>
          );
        })}
        <div className="target-key">
          <div />
          <span>Target (6/10)</span>
        </div>
      </div>

      <div className="card">
        <h3 className="block-title">Evidence Plan</h3>
        {indexedSkills.map(({ skill, index, score }) => {
          const evidence = state.evidence[index];
          const color = getSkillColor(score);
          return (
            <div key={skill} className="evidence-result">
              <div className="evidence-result__head">
                <span>{skill}</span>
                <span style={{ color }}>{score}/10</span>
              </div>
              {evidence.trim() ? <p>{evidence}</p> : <p className="evidence-result__empty">No evidence noted</p>}
            </div>
          );
        })}
      </div>

      <div className="actions actions--footer">
        <button className="btn btn--primary no-print" onClick={() => window.print()}>
          Print
        </button>
        <button className="btn btn--secondary no-print" onClick={onBack}>
          &lt;- Back
        </button>
        <button className="btn btn--danger no-print" onClick={onStartAgain}>
          Start again
        </button>
      </div>
    </section>
  );
}

export default ResultsStep;

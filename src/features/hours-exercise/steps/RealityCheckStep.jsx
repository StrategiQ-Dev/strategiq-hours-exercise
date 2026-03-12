import { formatDate } from "../../../utils/date";

function RealityCheckStep({ state, metrics, onBack, onNext }) {
  return (
    <section>
      <h2 className="section-title">The Reality Check</h2>
      <p className="section-subtitle">Take a moment to sit with this number.</p>

      <div className="card card--dark card--centered card--hero">
        <p className="eyebrow eyebrow--light">Your Real Hours to {state.goal}</p>
        <div className="hero-number">{metrics.realHours.toLocaleString()}</div>
        <p className="hero-caption">hours between now and {formatDate(state.targetDate)}</p>
      </div>

      <div className="card card--note card--warning">
        <p className="note-title">You have already spent some getting here - be deliberate</p>
        <p className="note-copy">
          Those {metrics.realHours.toLocaleString()} hours will pass regardless. The question is whether you spend them
          deliberately. Every interaction, every project, every conversation either builds the case for your goal - or
          it does not.
        </p>
      </div>

      <div className="card card--note card--neutral">
        <p className="note-title">High achievement is a seven-day mindset, not five</p>
        <p className="note-copy">
          The people who get there fastest do not switch off at the weekend. That does not mean working every hour - it
          means staying curious, building relationships, and thinking about your goal seven days a week.
        </p>
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={onBack}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={onNext}>
          Next: Skills Assessment -&gt;
        </button>
      </div>
    </section>
  );
}

export default RealityCheckStep;

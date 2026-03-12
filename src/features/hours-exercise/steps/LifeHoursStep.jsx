import SliderRow from "../../../components/SliderRow";
import StatCard from "../../../components/StatCard";

function LifeHoursStep({ state, metrics, update, onBack, onNext }) {
  return (
    <section>
      <h2 className="section-title">Life Hours</h2>
      <p className="section-subtitle">
        Adjust the sliders to reflect your real daily commitments. This reveals how much time you truly have.
      </p>

      <div className="card">
        <SliderRow label="Sleep" value={state.sleep} min={5} max={10} onChange={(value) => update({ sleep: value })} />
        <SliderRow
          label="Exercise"
          value={state.exercise}
          min={0}
          max={3}
          onChange={(value) => update({ exercise: value })}
        />
        <SliderRow
          label="Travel / Commute"
          value={state.travel}
          min={0}
          max={5}
          onChange={(value) => update({ travel: value })}
        />
        <SliderRow
          label="Eating & Daily Admin"
          value={state.eating}
          min={1}
          max={4}
          onChange={(value) => update({ eating: value })}
        />
        <SliderRow
          label="Family & Friends"
          value={state.family}
          min={0}
          max={5}
          onChange={(value) => update({ family: value })}
        />
      </div>

      <div className="two-col-grid stat-grid-4">
        <StatCard label="Total Life Hours / Day" value={`${metrics.totalLife}h`} />
        <StatCard label="Free Hours / Day" value={`${metrics.freePerDay.toFixed(1)}h`} />
        <StatCard label="Days Remaining" value={metrics.days.toLocaleString()} />
        <StatCard label="Real Hours" value={metrics.realHours.toLocaleString()} navy />
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={onBack}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={onNext}>
          Next: Reality Check -&gt;
        </button>
      </div>
    </section>
  );
}

export default LifeHoursStep;

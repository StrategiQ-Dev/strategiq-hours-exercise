function GoalStep({ state, errors, setErrors, update, onNext }) {
  return (
    <section>
      <h2 className="section-title">The Goal</h2>
      <p className="section-subtitle">Start with who you are and what you are aiming for.</p>

      <div className="card">
        <div className="field">
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            className={`input ${errors.name ? "input--error" : ""}`}
            type="text"
            value={state.name}
            onChange={(event) => {
              update({ name: event.target.value });
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="e.g. Sarah Jones"
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="field">
          <label className="label" htmlFor="goal">
            Your goal
          </label>
          <input
            id="goal"
            className={`input ${errors.goal ? "input--error" : ""}`}
            type="text"
            value={state.goal}
            onChange={(event) => {
              update({ goal: event.target.value });
              if (errors.goal) setErrors((prev) => ({ ...prev, goal: undefined }));
            }}
            placeholder="e.g. Client Director"
          />
          {errors.goal && <p className="field-error">{errors.goal}</p>}
        </div>

        <div className="field field--no-margin">
          <label className="label" htmlFor="target-date">
            Target date
          </label>
          <input
            id="target-date"
            className={`input ${errors.targetDate ? "input--error" : ""}`}
            type="date"
            value={state.targetDate}
            onChange={(event) => {
              update({ targetDate: event.target.value });
              if (errors.targetDate) setErrors((prev) => ({ ...prev, targetDate: undefined }));
            }}
          />
          {errors.targetDate && <p className="field-error">{errors.targetDate}</p>}
        </div>
      </div>

      <button className="btn btn--primary" onClick={onNext}>
        Next: Life Hours -&gt;
      </button>
    </section>
  );
}

export default GoalStep;

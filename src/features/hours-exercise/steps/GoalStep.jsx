function GoalStep({ state, errors, setErrors, update, onNext, isGeneratingSkills }) {
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
          <label className="label" htmlFor="goal_type">Goal Type</label>
          <div className="radio-group">
            <label className="radio-group__label">
              <input
                id="goal_type_1"
                className="radio-group__input"
                type="radio"
                value="1"
                checked={state.goal_type === "1"}
                onChange={(event) => {
                  update({ goal_type: event.target.value });
                  if (errors.goal_type) setErrors((prev) => ({ ...prev, goal_type: undefined }));
                }}
              />
              <span className="ico ico--briefcase"></span>
              <span className="radio-group__text">Career</span>
            </label>
            <label className="radio-group__label">
              <input
                id="goal_type_2"
                className="radio-group__input"
                type="radio"
                value="2"
                checked={state.goal_type === "2"}
                onChange={(event) => {
                  update({ goal_type: event.target.value });
                  if (errors.goal_type) setErrors((prev) => ({ ...prev, goal_type: undefined }));
                }}
              />
              <span className="ico ico--building"></span>
              <span className="radio-group__text">Business</span>
            </label>
            <label className="radio-group__label">
              <input
                id="goal_type_3"
                className="radio-group__input"
                type="radio"
                value="3"
                checked={state.goal_type === "3"}
                onChange={(event) => {
                  update({ goal_type: event.target.value });
                  if (errors.goal_type) setErrors((prev) => ({ ...prev, goal_type: undefined }));
                }}
              />
              <span className="ico ico--user-star"></span>
              <span className="radio-group__text">Personal</span>
            </label>
          </div>
          {errors.goal_type && <p className="field-error">{errors.goal_type}</p>}
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

      <button className="btn btn--primary" onClick={onNext} disabled={isGeneratingSkills}>
        {isGeneratingSkills ? "Generating Skills..." : "Next: Life Hours ->"}
      </button>
    </section>
  );
}

export default GoalStep;

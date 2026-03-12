import { useEffect, useState } from "react";
import SliderRow from "./components/SliderRow";
import StatCard from "./components/StatCard";
import { SKILLS } from "./constants/skills";
import { daysRemaining, formatDate, getDefaultDate } from "./utils/date";
import { storage } from "./utils/storage";

const STORAGE_KEY = "hours-exercise-v1";
const LOGO_PATH = "/assets/strategiq-logo-black.svg";

const makeDefault = () => ({
  step: 0,
  name: "",
  goal: "",
  targetDate: getDefaultDate(),
  sleep: 7,
  exercise: 1,
  travel: 2,
  eating: 2,
  family: 2,
  skills: [0, 0, 0, 0, 0, 0, 0, 0],
  evidence: ["", "", "", "", "", "", "", ""],
});

const getSkillColor = (score) => {
  if (score < 4) return "var(--he-danger)";
  if (score < 6) return "var(--he-warning)";
  if (score === 6) return "var(--he-info)";
  return "var(--he-success)";
};

function App() {
  const [state, setState] = useState(makeDefault);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const raw = storage.get(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.step > 0) setHasSavedData(true);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (state.step === 0) return;
    storage.set(STORAGE_KEY, JSON.stringify(state));
    setSavedIndicator(true);
    const timer = setTimeout(() => setSavedIndicator(false), 2200);
    return () => clearTimeout(timer);
  }, [state]);

  const update = (patch) => setState((prev) => ({ ...prev, ...patch }));

  const resume = () => {
    try {
      const raw = storage.get(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) setState({ ...makeDefault(), ...parsed });
      }
    } catch (_) {}
  };

  const startAgain = () => {
    if (window.confirm("Are you sure? This will clear all your saved progress.")) {
      storage.set(STORAGE_KEY, null);
      setState(makeDefault());
      setHasSavedData(false);
    }
  };

  const totalLife = state.sleep + state.exercise + state.travel + state.eating + state.family;
  const freePerDay = Math.max(0, 24 - totalLife);
  const days = daysRemaining(state.targetDate);
  const realHours = Math.round(freePerDay * days);
  const gaps = state.skills.filter((s) => s < 6).length;
  const avgScore = (state.skills.reduce((a, b) => a + b, 0) / 8).toFixed(1);
  const progress = (state.step / 6) * 100;

  const renderIntro = () => (
    <section className="intro">
      <img src={LOGO_PATH} alt="StrategiQ" className="intro__floating-logo" />
      <p className="eyebrow">Career Planning Framework</p>
      <h1 className="intro__title">
        The Hours
        <br />
        Exercise
      </h1>
      <p className="intro__copy">
        A structured six-step process to clarify your career goal, understand the time you truly have available,
        and build a deliberate plan for the skills that will get you there.
      </p>
      <div className="actions">
        <button className="btn btn--primary" onClick={() => update({ step: 1 })}>
          Begin the exercise -&gt;
        </button>
        {hasSavedData && (
          <button className="btn btn--secondary" onClick={resume}>
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

  const renderStep1 = () => {
    const validate = () => {
      const nextErrors = {};
      if (!state.name.trim()) nextErrors.name = "Please enter your name.";
      if (!state.goal.trim()) nextErrors.goal = "Please enter your goal.";
      if (!state.targetDate) nextErrors.targetDate = "Please select a target date.";
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    };

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

        <button className="btn btn--primary" onClick={() => validate() && update({ step: 2 })}>
          Next: Life Hours -&gt;
        </button>
      </section>
    );
  };

  const renderStep2 = () => (
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
        <StatCard label="Total Life Hours / Day" value={`${totalLife}h`} />
        <StatCard label="Free Hours / Day" value={`${freePerDay.toFixed(1)}h`} />
        <StatCard label="Days Remaining" value={days.toLocaleString()} />
        <StatCard label="Real Hours" value={realHours.toLocaleString()} navy />
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={() => update({ step: 1 })}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={() => update({ step: 3 })}>
          Next: Reality Check -&gt;
        </button>
      </div>
    </section>
  );

  const renderStep3 = () => (
    <section>
      <h2 className="section-title">The Reality Check</h2>
      <p className="section-subtitle">Take a moment to sit with this number.</p>

      <div className="card card--dark card--centered card--hero">
        <p className="eyebrow eyebrow--light">Your Real Hours to {state.goal}</p>
        <div className="hero-number">{realHours.toLocaleString()}</div>
        <p className="hero-caption">hours between now and {formatDate(state.targetDate)}</p>
      </div>

      <div className="card card--note card--warning">
        <p className="note-title">You have already spent some getting here - be deliberate</p>
        <p className="note-copy">
          Those {realHours.toLocaleString()} hours will pass regardless. The question is whether you spend them
          deliberately. Every interaction, every project, every conversation either builds the case for your goal - or
          it does not.
        </p>
      </div>

      <div className="card card--note card--neutral">
        <p className="note-title">High achievement is a seven-day mindset, not five</p>
        <p className="note-copy">
          The people who get there fastest do not switch off at the weekend. That does not mean working every hour -
          it means staying curious, building relationships, and thinking about your goal seven days a week.
        </p>
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={() => update({ step: 2 })}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={() => update({ step: 4 })}>
          Next: Skills Assessment -&gt;
        </button>
      </div>
    </section>
  );

  const renderStep4 = () => (
    <section>
      <h2 className="section-title">Skills Assessment</h2>
      <p className="section-subtitle">Rate yourself honestly from 0 to 10. The target for each skill is 6.</p>

      <div className="card card--skills">
        {SKILLS.map((skill, index) => {
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
                      onClick={() => {
                        setState((prev) => {
                          const nextSkills = [...prev.skills];
                          nextSkills[index] = number === prev.skills[index] ? Math.max(0, number - 1) : number;
                          return { ...prev, skills: nextSkills };
                        });
                      }}
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

      <div className={`status-card ${gaps > 0 ? "status-card--warning" : "status-card--success"}`}>
        {gaps > 0
          ? `${gaps} skill gap${gaps !== 1 ? "s" : ""} identified (below 6/10)`
          : "All skills on target - excellent foundation"}
      </div>

      <div className="actions">
        <button className="btn btn--secondary" onClick={() => update({ step: 3 })}>
          &lt;- Back
        </button>
        <button className="btn btn--primary" onClick={() => update({ step: 5 })}>
          Next: Evidence Plan -&gt;
        </button>
      </div>
    </section>
  );

  const renderStep5 = () => {
    const indexed = SKILLS.map((skill, index) => ({ skill, index, score: state.skills[index] }));
    const sorted = [...indexed.filter((item) => item.score < 6), ...indexed.filter((item) => item.score >= 6)];

    return (
      <section>
        <h2 className="section-title">Evidence Plan</h2>
        <p className="section-subtitle">
          For each skill, note the specific evidence you will build. Be concrete - what will you do, with whom, by
          when?
        </p>

        {sorted.map(({ skill, index, score }) => {
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
          <button className="btn btn--secondary" onClick={() => update({ step: 4 })}>
            &lt;- Back
          </button>
          <button className="btn btn--primary" onClick={() => update({ step: 6 })}>
            View Results -&gt;
          </button>
        </div>
      </section>
    );
  };

  const renderStep6 = () => {
    const indexed = SKILLS.map((skill, index) => ({ skill, index, score: state.skills[index] }));
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
            { label: "Real Hours", value: realHours.toLocaleString() },
            { label: "Days Remaining", value: days.toLocaleString() },
            { label: "Skill Gaps", value: gaps },
            { label: "Avg Score", value: `${avgScore}/10` },
          ].map((item) => (
            <div key={item.label} className="result-stat">
              <div className="result-stat__value">{item.value}</div>
              <div className="result-stat__label">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="block-title">Skills Overview</h3>
          {indexed.map(({ skill, score }) => {
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
          {indexed.map(({ skill, index, score }) => {
            const evidence = state.evidence[index];
            const color = getSkillColor(score);
            return (
              <div key={skill} className="evidence-result">
                <div className="evidence-result__head">
                  <span>{skill}</span>
                  <span style={{ color }}>{score}/10</span>
                </div>
                {evidence.trim() ? (
                  <p>{evidence}</p>
                ) : (
                  <p className="evidence-result__empty">No evidence noted</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="actions actions--footer">
          <button className="btn btn--primary no-print" onClick={() => window.print()}>
            Print
          </button>
          <button className="btn btn--secondary no-print" onClick={() => update({ step: 5 })}>
            &lt;- Back
          </button>
          <button className="btn btn--danger no-print" onClick={startAgain}>
            Start again
          </button>
        </div>
      </section>
    );
  };

  const stepContent =
    state.step === 0
      ? renderIntro()
      : state.step === 1
        ? renderStep1()
        : state.step === 2
          ? renderStep2()
          : state.step === 3
            ? renderStep3()
            : state.step === 4
              ? renderStep4()
              : state.step === 5
                ? renderStep5()
                : renderStep6();

  return (
    <div className="hours-app">
      {state.step > 0 && (
        <header id="he-topbar" className="topbar">
          <div className="topbar__progress-track">
            <div className="topbar__progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="topbar__inner">
            <div className="topbar__brand">
              <img src={LOGO_PATH} alt="StrategiQ" />
              <span>The Hours Exercise · Step {state.step} of 6</span>
            </div>
            <span className={`topbar__saved ${savedIndicator ? "topbar__saved--visible" : ""}`}>Saved ●</span>
          </div>
        </header>
      )}

      <main className={`container ${state.step === 0 ? "container--intro" : ""}`}>{stepContent}</main>
    </div>
  );
}

export default App;

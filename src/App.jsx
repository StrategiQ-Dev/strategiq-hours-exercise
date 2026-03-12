import { useEffect, useState } from "react";
import IntroStep from "./features/hours-exercise/steps/IntroStep";
import GoalStep from "./features/hours-exercise/steps/GoalStep";
import LifeHoursStep from "./features/hours-exercise/steps/LifeHoursStep";
import RealityCheckStep from "./features/hours-exercise/steps/RealityCheckStep";
import SkillsAssessmentStep from "./features/hours-exercise/steps/SkillsAssessmentStep";
import EvidencePlanStep from "./features/hours-exercise/steps/EvidencePlanStep";
import ResultsStep from "./features/hours-exercise/steps/ResultsStep";
import {
  calculateMetrics,
  createDefaultState,
  LOGO_PATH,
  STORAGE_KEY,
  validateGoalStep,
  generateSkills,
} from "./features/hours-exercise/helpers";
import { storage } from "./utils/storage";

function App() {
  const [state, setState] = useState(createDefaultState);
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
        if (parsed) setState({ ...createDefaultState(), ...parsed });
      }
    } catch (_) {}
  };

  const startAgain = () => {
    if (window.confirm("Are you sure? This will clear all your saved progress.")) {
      storage.set(STORAGE_KEY, null);
      setState(createDefaultState());
      setHasSavedData(false);
    }
  };

  const metrics = calculateMetrics(state);

  const stepContentMap = {
    0: (
      <IntroStep hasSavedData={hasSavedData} onBegin={() => update({ step: 1 })} onResume={resume} logoPath={LOGO_PATH} />
    ),
    1: (
      <GoalStep
        state={state}
        errors={errors}
        setErrors={setErrors}
        update={update}
        onNext={() => {
          const nextErrors = validateGoalStep(state);
          setErrors(nextErrors);
          // generateSkills(state);
          if (Object.keys(nextErrors).length === 0) update({ step: 2 });
        }}
      />
    ),
    2: (
      <LifeHoursStep
        state={state}
        metrics={metrics}
        update={update}
        onBack={() => update({ step: 1 })}
        onNext={() => update({ step: 3 })}
      />
    ),
    3: (
      <RealityCheckStep
        state={state}
        metrics={metrics}
        onBack={() => update({ step: 2 })}
        onNext={() => update({ step: 4 })}
      />
    ),
    4: (
      <SkillsAssessmentStep
        state={state}
        metrics={metrics}
        setState={setState}
        onBack={() => update({ step: 3 })}
        onNext={() => update({ step: 5 })}
      />
    ),
    5: <EvidencePlanStep state={state} setState={setState} onBack={() => update({ step: 4 })} onNext={() => update({ step: 6 })} />,
    6: <ResultsStep state={state} metrics={metrics} onBack={() => update({ step: 5 })} onStartAgain={startAgain} />,
  };

  const stepContent = stepContentMap[state.step] ?? stepContentMap[0];

  return (
    <div className="hours-app">
      {state.step > 0 && (
        <header id="he-topbar" className="topbar">
          <div className="topbar__progress-track">
            <div className="topbar__progress-fill" style={{ width: `${metrics.progress}%` }} />
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

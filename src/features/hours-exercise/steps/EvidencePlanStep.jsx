import { useState } from "react";
import {
  generateEvidenceStarterPlan,
  generateEvidenceSuggestions,
  getSkillColor,
  sortSkillsByGapFirst,
} from "../helpers";

function EvidencePlanStep({ state, setState, onBack, onNext }) {
  const sortedSkills = sortSkillsByGapFirst(state.skills, state.skillLabels);
  const [loadingBySkill, setLoadingBySkill] = useState({});
  const [draftLoadingBySkill, setDraftLoadingBySkill] = useState({});
  const [errorBySkill, setErrorBySkill] = useState({});

  const runSuggestionAnalysis = async ({ index, skill, score }) => {
    const plan = state.evidence?.[index] ?? "";
    if (!plan.trim()) return;

    setLoadingBySkill((prev) => ({ ...prev, [index]: true }));
    setErrorBySkill((prev) => ({ ...prev, [index]: "" }));

    const { suggestions, error } = await generateEvidenceSuggestions({
      state,
      skill,
      score,
      plan,
    });

    setState((prev) => {
      const nextSuggestions = Array.isArray(prev.evidenceSuggestions)
        ? [...prev.evidenceSuggestions]
        : Array.from({ length: prev.skillLabels.length }, () => []);
      nextSuggestions[index] = suggestions;
      return { ...prev, evidenceSuggestions: nextSuggestions };
    });

    if (error) {
      setErrorBySkill((prev) => ({ ...prev, [index]: error }));
    }
    setLoadingBySkill((prev) => ({ ...prev, [index]: false }));
  };

  const runStarterPlan = async ({ index, skill, score }) => {
    const existingPlan = state.evidence?.[index] ?? "";
    if (
      existingPlan.trim() &&
      !window.confirm("Replace your current plan text with an AI starter plan?")
    ) {
      return;
    }

    setDraftLoadingBySkill((prev) => ({ ...prev, [index]: true }));
    setErrorBySkill((prev) => ({ ...prev, [index]: "" }));

    const { plan, error } = await generateEvidenceStarterPlan({
      state,
      skill,
      score,
    });

    if (plan) {
      setState((prev) => {
        const nextEvidence = [...prev.evidence];
        nextEvidence[index] = plan;
        const nextSuggestions = Array.isArray(prev.evidenceSuggestions)
          ? [...prev.evidenceSuggestions]
          : Array.from({ length: prev.skillLabels.length }, () => []);
        nextSuggestions[index] = [];
        return { ...prev, evidence: nextEvidence, evidenceSuggestions: nextSuggestions };
      });
    }

    if (error) {
      setErrorBySkill((prev) => ({ ...prev, [index]: error }));
    }

    setDraftLoadingBySkill((prev) => ({ ...prev, [index]: false }));
  };

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
        const planText = state.evidence?.[index] ?? "";
        const suggestions = state.evidenceSuggestions?.[index] ?? [];
        const isLoading = Boolean(loadingBySkill[index]);
        const isDraftLoading = Boolean(draftLoadingBySkill[index]);
        const isVeryLowScore = score <= 4;
        const hasPlan = Boolean(planText.trim());
        const errorMessage = errorBySkill[index];

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
                  const nextSuggestions = Array.isArray(prev.evidenceSuggestions)
                    ? [...prev.evidenceSuggestions]
                    : Array.from({ length: prev.skillLabels.length }, () => []);
                  nextSuggestions[index] = [];
                  return { ...prev, evidence: nextEvidence, evidenceSuggestions: nextSuggestions };
                });
              }}
              placeholder={
                isGap
                  ? "What specific work, projects, or actions will build this skill?"
                  : "What will you do to maintain and demonstrate this strength?"
              }
            />

            <div className="evidence-ai-actions">
              {isVeryLowScore && (
                <button
                  className="btn btn--secondary"
                  onClick={() => runStarterPlan({ index, skill, score })}
                  disabled={isDraftLoading || isLoading}
                >
                  {isDraftLoading ? "Drafting starter plan..." : "AI Draft Starter Plan"}
                </button>
              )}
              <button
                className="btn btn--secondary"
                onClick={() => runSuggestionAnalysis({ index, skill, score })}
                disabled={!hasPlan || isLoading || isDraftLoading}
              >
                {isLoading ? "Analysing..." : "AI Suggest Next Actions"}
              </button>
              {!hasPlan && <span className="evidence-ai-hint">Add a plan first to run analysis.</span>}
            </div>

            {errorMessage && <p className="field-error evidence-ai-error">{errorMessage}</p>}

            {suggestions.length > 0 && (
              <div className="evidence-ai-results">
                <p className="evidence-ai-results__title">AI suggestions (max 6)</p>
                <ul className="evidence-ai-results__list">
                  {suggestions.map((item, suggestionIndex) => (
                    <li key={`${skill}-suggestion-${suggestionIndex}`} className="evidence-ai-results__item">
                      <div className="evidence-ai-results__head">
                        <span>{item.type}</span>
                        <span>{item.hours}h</span>
                      </div>
                      <p className="evidence-ai-results__task">{item.task}</p>
                      <p className="evidence-ai-results__why">{item.why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

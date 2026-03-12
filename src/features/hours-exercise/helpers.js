import { SKILLS } from "../../constants/skills";
import { daysRemaining, getDefaultDate } from "../../utils/date";

export const STORAGE_KEY = "hours-exercise-v1";
export const LOGO_PATH = "/assets/strategiq-logo-black.svg";

export const createDefaultState = () => ({
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

export const getSkillColor = (score) => {
  if (score < 4) return "var(--he-danger)";
  if (score < 6) return "var(--he-warning)";
  if (score === 6) return "var(--he-info)";
  return "var(--he-success)";
};

export const validateGoalStep = (state) => {
  const errors = {};
  if (!state.name.trim()) errors.name = "Please enter your name.";
  if (!state.goal.trim()) errors.goal = "Please enter your goal.";
  if (!state.targetDate) errors.targetDate = "Please select a target date.";
  return errors;
};

export const calculateMetrics = (state) => {
  const totalLife = state.sleep + state.exercise + state.travel + state.eating + state.family;
  const freePerDay = Math.max(0, 24 - totalLife);
  const days = daysRemaining(state.targetDate);
  const realHours = Math.round(freePerDay * days);
  const gaps = state.skills.filter((score) => score < 6).length;
  const avgScore = (state.skills.reduce((sum, score) => sum + score, 0) / SKILLS.length).toFixed(1);
  const progress = (state.step / 6) * 100;

  return {
    totalLife,
    freePerDay,
    days,
    realHours,
    gaps,
    avgScore,
    progress,
  };
};

export const getIndexedSkills = (skills) => SKILLS.map((skill, index) => ({ skill, index, score: skills[index] }));

export const sortSkillsByGapFirst = (skills) => {
  const indexed = getIndexedSkills(skills);
  return [...indexed.filter((item) => item.score < 6), ...indexed.filter((item) => item.score >= 6)];
};

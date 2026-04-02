import { SKILLS } from "../../constants/skills";
import { daysRemaining, getDefaultDate } from "../../utils/date";
import OpenAI from "openai";

export const STORAGE_KEY = "hours-exercise-v1";
export const LOGO_PATH = "/assets/strategiq-logo-black.svg";
const GOAL_TYPE_LABELS = {
  "1": "Career",
  "2": "Business",
  "3": "Personal",
};

const normalizeSkillList = (skills) => {
  const list = Array.isArray(skills) ? skills : [];
  const deduped = [];

  for (const item of list) {
    const normalized = String(item ?? "")
      .trim()
      .replace(/\.$/, "");
    if (!normalized) continue;
    if (!deduped.some((existing) => existing.toLowerCase() === normalized.toLowerCase())) {
      deduped.push(normalized);
    }
    if (deduped.length === SKILLS.length) break;
  }

  return deduped;
};

const getFallbackSkills = (state) => {
  const byGoalType = {
    "1": [
      "Strategic thinking",
      "Executive communication",
      "Stakeholder influence",
      "Commercial acumen",
      "Cross-functional collaboration",
      "Decision making",
      "Leadership presence",
      "Client relationship building",
    ],
    "2": [
      "Market positioning",
      "Sales strategy",
      "Financial planning",
      "Offer design",
      "Negotiation",
      "Operational execution",
      "Team leadership",
      "Customer retention",
    ],
    "3": [
      "Goal clarity",
      "Consistency",
      "Time management",
      "Self-discipline",
      "Communication",
      "Resilience",
      "Learning agility",
      "Support network building",
    ],
  };

  const baseSkills = byGoalType[state.goal_type] ?? SKILLS;
  return normalizeSkillList(baseSkills);
};

export const createDefaultState = () => ({
  step: 0,
  name: "",
  goal_type: "",
  goal: "",
  targetDate: getDefaultDate(),
  sleep: 7,
  exercise: 1,
  travel: 2,
  eating: 2,
  family: 2,
  skillLabels: [...SKILLS],
  skills: Array(SKILLS.length).fill(0),
  evidence: Array(SKILLS.length).fill(""),
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
  if (!state.goal_type) errors.goal_type = "Please select a goal type.";
  if (!state.goal.trim()) errors.goal = "Please enter your goal.";
  if (!state.targetDate) errors.targetDate = "Please select a target date.";
  return errors;
};

export const calculateMetrics = (state) => {
  const totalLife = state.sleep + state.exercise + state.travel + state.eating + state.family;
  const freePerDay = Math.max(0, 24 - totalLife);
  const days = daysRemaining(state.targetDate);
  const realHours = Math.round(freePerDay * days);
  const skillsCount = state.skillLabels?.length || SKILLS.length;
  const normalizedScores = state.skills.slice(0, skillsCount);
  const gaps = normalizedScores.filter((score) => score < 6).length;
  const avgScore = (normalizedScores.reduce((sum, score) => sum + score, 0) / skillsCount).toFixed(1);
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

export const getIndexedSkills = (skills, skillLabels = SKILLS) =>
  skillLabels.map((skill, index) => ({ skill, index, score: skills[index] }));

export const sortSkillsByGapFirst = (skills, skillLabels = SKILLS) => {
  const indexed = getIndexedSkills(skills, skillLabels);
  return [...indexed.filter((item) => item.score < 6), ...indexed.filter((item) => item.score >= 6)];
};

export const generateSkills = async (state) => {
  const fallback = getFallbackSkills(state);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return fallback;

  try {
    const goalType = GOAL_TYPE_LABELS[state.goal_type] ?? "General";
    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "skill_generation",
            schema: {
              type: "object",
              properties: {
                skills: {
                  type: "array",
                  minItems: SKILLS.length,
                  maxItems: SKILLS.length,
                  items: { type: "string" },
                },
              },
              required: ["skills"],
              additionalProperties: false,
            },
          },
        },
        messages: [
          {
            role: "system",
            content:
              "You create concise, scorable skill labels. Return exactly 8 skills suitable for self-rating 0-10.",
          },
          {
            role: "user",
            content: `Goal type: ${goalType}. Goal: "${state.goal}". Return 8 specific skills that are most relevant to achieving this goal.`,
          },
        ],
    });

    const raw = completion?.choices?.[0]?.message?.content;
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    const normalized = normalizeSkillList(parsed?.skills);

    if (normalized.length !== SKILLS.length) return fallback;
    return normalized;
  } catch (_) {
    return fallback;
  }
};
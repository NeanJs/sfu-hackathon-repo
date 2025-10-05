import { ProfileQuestion, UserPreferences } from "./types";

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    key: "pmv_future",
    question: "What should governments do to solve society's problems?",
    options: [
      { value: "Less", label: "Less government involvement", pmv: "A" },
      { value: "Stay the same", label: "Keep current levels", pmv: "B" },
      { value: "More", label: "More government involvement", pmv: "C" },
    ],
    criteria: {
      "Less": "Prefers minimal government intervention, emphasizing individual responsibility and free-market solutions",
      "Stay the same": "Maintains current balance of government involvement and individual initiative",
      "More": "Supports expanded government programs and intervention for societal problem-solving",
    },
  },
  {
    key: "pmv_protection",
    question: "Which is more important:",
    options: [
      { value: "Protecting traditional values", label: "Preserve existing values and traditions", pmv: "A" },
      { value: "Balancing tradition and progress", label: "Find balance between old and new", pmv: "B" },
      { value: "Supporting social change", label: "Embrace progress and reform", pmv: "C" },
    ],
    criteria: {
      "Protecting traditional values": "Prioritizes preservation of established moral and cultural norms",
      "Balancing tradition and progress": "Seeks equilibrium between traditional values and societal advancement",
      "Supporting social change": "Advocates for progressive reforms and cultural evolution",
    },
  },
  {
    key: "pmv_economy",
    question: "What would you consider would create the best economy?",
    options: [
      { value: "Lower taxes and markets", label: "Reduce taxes and market regulation", pmv: "A" },
      { value: "Mixed approach", label: "Balance markets with social programs", pmv: "B" },
      { value: "Programs to reduce inequality", label: "Increase social programs and equality", pmv: "C" },
    ],
    criteria: {
      "Lower taxes and markets": "Advocates for free market solutions with minimal taxation and regulation",
      "Mixed approach": "Supports regulated markets with balanced social programs",
      "Programs to reduce inequality": "Emphasizes economic equality through government programs",
    },
  },
];

export function buildPreferencePrompt(preferences: UserPreferences): string {
  const statements: string[] = [];

  PROFILE_QUESTIONS.forEach(q => {
    const selectedValue = preferences[q.key];
    if (selectedValue) {
      const criterion = q.criteria[selectedValue];
      if (criterion) {
        statements.push(`The user ${criterion}.`);
      }
    }
  });

  if (statements.length === 0) {
    return "The user has not specified any particular political or moral views.";
  }

  return `Based on the user's political and moral views: ${statements.join(" ")} Identify companies whose activities or ethical stances are in direct conflict with these stated preferences.`;
}

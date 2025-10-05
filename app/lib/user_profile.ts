import { ProfileQuestion, UserPreferences } from './types';

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    key: 'economicStance',
    question: 'What is your general stance on economic regulation for large corporations?',
    placeholder: 'e.g., "Strongly pro-regulation to ensure fairness"',
  },
  {
    key: 'environmentalStance',
    question: 'How urgently should corporations address their environmental impact?',
    placeholder: 'e.g., "Demand aggressive, immediate climate action"',
  },
  {
    key: 'laborStance',
    question: 'What is your position on labor rights and unionization?',
    placeholder: 'e.g., "Unwavering support for strong unions"',
  },
  {
    key: 'socialStance',
    question: 'What role should corporations play in social issues and community wealth?',
    placeholder: 'e.g., "They must prioritize community wealth and social justice"',
  },
];

export function buildPreferencePrompt(preferences: UserPreferences): string {
  return `The user's political and moral compass is defined by the following principles: 
- On the economy, they believe in ${preferences.economicStance}.
- Regarding the environment, they demand ${preferences.environmentalStance}.
- On labor issues, their stance is ${preferences.laborStance}.
- In terms of social impact, they advocate that corporations ${preferences.socialStance}.
This profile should heavily influence the selection of companies, prioritizing those with violations in these specific areas.`;
}

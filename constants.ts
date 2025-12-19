import { Milestone } from "./types";

// Ranks provide visual flair and titles based on Level ranges
export const LEVEL_RANKS = [
  { minLevel: 1, title: "Rookie Typist", icon: "fa-seedling", color: "text-slate-500", bg: "bg-slate-100" },
  { minLevel: 5, title: "Apprentice", icon: "fa-scroll", color: "text-green-500", bg: "bg-green-100" },
  { minLevel: 10, title: "Keyboard Warrior", icon: "fa-shield-halved", color: "text-blue-500", bg: "bg-blue-100" },
  { minLevel: 20, title: "Speed Demon", icon: "fa-bolt", color: "text-yellow-500", bg: "bg-yellow-100" },
  { minLevel: 30, title: "Cyber Ninja", icon: "fa-user-ninja", color: "text-purple-500", bg: "bg-purple-100" },
  { minLevel: 40, title: "Grandmaster", icon: "fa-crown", color: "text-red-500", bg: "bg-red-100" },
  { minLevel: 50, title: "Typing God", icon: "fa-dragon", color: "text-indigo-600", bg: "bg-indigo-100" },
];

export const getRank = (level: number) => {
  return [...LEVEL_RANKS].reverse().find(r => level >= r.minLevel) || LEVEL_RANKS[0];
};

// Smoother XP Curve: Early levels are fast, later levels require grind
export const LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 150 },   // ~1-2 good tests
  { level: 3, xp: 400 },   // ~3 tests
  { level: 4, xp: 800 },
  { level: 5, xp: 1300 },
  { level: 6, xp: 2000 },
  { level: 7, xp: 2900 },
  { level: 8, xp: 4000 },
  { level: 9, xp: 5500 },
  { level: 10, xp: 7500 }, // Milestone
  { level: 11, xp: 10000 },
  { level: 15, xp: 22000 },
  { level: 20, xp: 40000 },
  { level: 30, xp: 90000 },
  { level: 40, xp: 160000 },
  { level: 50, xp: 250000 },
];

export const MILESTONES: Milestone[] = [
  // Rank Landmarks (New)
  { id: 'rank-rookie', name: 'Rookie Typist', description: 'Begin your journey (Level 1)', requiredLevel: 1, icon: 'fa-seedling text-green-400' },
  { id: 'rank-apprentice', name: 'Apprentice', description: 'Reach Level 5', requiredLevel: 5, icon: 'fa-scroll text-amber-600' },
  { id: 'rank-warrior', name: 'Keyboard Warrior', description: 'Reach Level 10', requiredLevel: 10, icon: 'fa-shield-halved text-blue-500' },
  { id: 'rank-demon', name: 'Speed Demon', description: 'Reach Level 20', requiredLevel: 20, icon: 'fa-bolt text-yellow-500' },
  { id: 'rank-ninja', name: 'Cyber Ninja', description: 'Reach Level 30', requiredLevel: 30, icon: 'fa-user-ninja text-purple-600' },
  { id: 'rank-grandmaster', name: 'Grandmaster', description: 'Reach Level 40', requiredLevel: 40, icon: 'fa-crown text-red-500' },
  { id: 'rank-god', name: 'Typing God', description: 'Reach Level 50', requiredLevel: 50, icon: 'fa-dragon text-indigo-600' },

  // Speed Milestones
  { id: 'speed-40', name: 'Cruising Speed', description: 'Reach 40 WPM', requiredWpm: 40, icon: 'fa-gauge-simple text-blue-400' },
  { id: 'speed-60', name: 'Rapid Typer', description: 'Reach 60 WPM', requiredWpm: 60, icon: 'fa-gauge-high text-indigo-500' },
  { id: 'speed-80', name: 'Lightning Fingers', description: 'Reach 80 WPM', requiredWpm: 80, icon: 'fa-bolt text-yellow-400' },
  { id: 'speed-100', name: 'Grandmaster Speed', description: 'Reach 100 WPM', requiredWpm: 100, icon: 'fa-fire text-red-500' },

  // Consistency Milestones
  { id: 'bronze', name: 'Novice Typist', description: 'Complete 1 test', requiredTests: 1, icon: 'fa-medal text-amber-700' },
  { id: 'silver', name: 'Dedicated Typist', description: 'Complete 25 tests', requiredTests: 25, icon: 'fa-medal text-slate-400' },
  { id: 'gold', name: 'Master Typist', description: 'Complete 50 tests', requiredTests: 50, icon: 'fa-medal text-yellow-500' },
  { id: 'platinum', name: 'Keyboard Legend', description: 'Complete 100 tests', requiredTests: 100, icon: 'fa-crown text-purple-500' },
];

export const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
  "Typing fast is a skill that takes practice and patience. Regular exercises can help improve both your speed and accuracy over time.",
  "Technology continues to evolve at a rapid pace, changing the way we live, work, and communicate with one another across the globe.",
  "A journey of a thousand miles begins with a single step. Consistency is key to mastering any new skill, including touch typing.",
  "In software engineering, clean code is often more important than clever code. Readability helps teams maintain projects in the long run."
];

export const GEMINI_PROMPT = "Generate a random interesting paragraph about science, history, or technology for a typing test. It should be approximately 60-80 words long. Plain text only, no markdown.";
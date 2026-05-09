export interface ProfileStats {
  repos_viewed: number;
  issues_clicked: number;
  days_streak: number;
  max_streak: number;
  languages_explored: string[];
  achievements: string[];
  last_active_date: string | null;
}

export interface FullProfile {
  id: string;
  email: string | null;
  created_at: string;
  languages: string[];
  experience_years: string;
  open_source_experience: string;
  interests: string[];
  goal: string;
  stats: ProfileStats;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlockedWhen: (stats: ProfileStats) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_look',
    name: 'First Look',
    description: 'Viewed your first repository',
    icon: '🌱',
    requirement: 'View 1 repository',
    unlockedWhen: (s) => s.repos_viewed >= 1,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Viewed 10 repositories',
    icon: '🔍',
    requirement: 'View 10 repositories',
    unlockedWhen: (s) => s.repos_viewed >= 10,
  },
  {
    id: 'deep_diver',
    name: 'Deep Diver',
    description: 'Viewed 50 repositories',
    icon: '🌊',
    requirement: 'View 50 repositories',
    unlockedWhen: (s) => s.repos_viewed >= 50,
  },
  {
    id: 'repo_veteran',
    name: 'Repo Veteran',
    description: 'Viewed 100 repositories',
    icon: '🏛️',
    requirement: 'View 100 repositories',
    unlockedWhen: (s) => s.repos_viewed >= 100,
  },
  {
    id: 'issue_hunter',
    name: 'Issue Hunter',
    description: 'Clicked on 5 issues',
    icon: '🎯',
    requirement: 'Click 5 issues',
    unlockedWhen: (s) => s.issues_clicked >= 5,
  },
  {
    id: 'bug_slayer',
    name: 'Bug Slayer',
    description: 'Clicked on 50 issues',
    icon: '🐛',
    requirement: 'Click 50 issues',
    unlockedWhen: (s) => s.issues_clicked >= 50,
  },
  {
    id: 'committed',
    name: 'Committed',
    description: 'Maintain a 7 day streak',
    icon: '🔥',
    requirement: '7 day streak',
    unlockedWhen: (s) => s.max_streak >= 7,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Maintain a 30 day streak',
    icon: '💎',
    requirement: '30 day streak',
    unlockedWhen: (s) => s.max_streak >= 30,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Explore repos in 5 different languages',
    icon: '🌍',
    requirement: 'Explore 5 languages',
    unlockedWhen: (s) => (s.languages_explored ?? []).length >= 5,
  },
  {
    id: 'stack_master',
    name: 'Stack Master',
    description: 'Explore repos in 10 different languages',
    icon: '🔧',
    requirement: 'Explore 10 languages',
    unlockedWhen: (s) => (s.languages_explored ?? []).length >= 10,
  },
];

export const LANGUAGE_COLORS: Record<string, { bg: string; text: string }> = {
  TypeScript:  { bg: '#1e3a5f', text: '#3b82f6' },
  JavaScript:  { bg: '#3d3200', text: '#eab308' },
  Python:      { bg: '#1a2d4a', text: '#3b82f6' },
  Rust:        { bg: '#3d1a0e', text: '#f97316' },
  Go:          { bg: '#0e2d3d', text: '#06b6d4' },
  Ruby:        { bg: '#3d0e0e', text: '#ef4444' },
  Java:        { bg: '#3d2200', text: '#f97316' },
  'C#':        { bg: '#2d1a3d', text: '#a855f7' },
  PHP:         { bg: '#1a1a3d', text: '#6366f1' },
  'C++':       { bg: '#0e1a3d', text: '#3b82f6' },
};

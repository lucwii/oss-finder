export interface Profile {
  id: string;
  email: string | null;
  languages: string[];
  experience_years: string;
  open_source_experience: string;
  interests: string[];
  goal: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface FormData {
  languages: string[];
  experience_years: string;
  open_source_experience: string;
  interests: string[];
  goal: string;
}

export interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
  'Java', 'C#', 'PHP', 'Ruby', 'C++',
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

export const EXPERIENCE_OPTIONS = ['< 1 Year', '1-2 Years', '3-5 Years', '5+ Years'];
export const OSS_OPTIONS = ['Never', 'Once or twice', 'Regularly'];

export const INTERESTS = [
  { label: 'Web Development', emoji: '🌐' },
  { label: 'AI & ML',         emoji: '🤖' },
  { label: 'Developer Tools', emoji: '🛠️' },
  { label: 'Mobile',          emoji: '📱' },
  { label: 'CLI & Terminal',  emoji: '⌨️' },
  { label: 'Documentation',   emoji: '📚' },
  { label: 'Testing',         emoji: '🧪' },
  { label: 'Databases',       emoji: '🗄️' },
  { label: 'Security',        emoji: '🔒' },
  { label: 'Cloud & DevOps',  emoji: '☁️' },
];

export const GOALS = [
  { value: 'learn',     label: 'Learn New Technologies', emoji: '📖' },
  { value: 'resume',    label: 'Boost My Resume',         emoji: '💼' },
  { value: 'community', label: 'Give Back to Community',  emoji: '🤝' },
  { value: 'all',       label: 'All of the Above',        emoji: '🎯' },
];

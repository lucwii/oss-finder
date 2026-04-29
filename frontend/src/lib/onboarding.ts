export interface OnboardingData {
  languages:              string[];
  experience_years:       string;
  open_source_experience: string;
  interests:              string[];
  goal:                   string;
}

export const LANGUAGES = [
  { name: 'JavaScript', color: '#f7df1e', abbr: 'JS'  },
  { name: 'TypeScript', color: '#3178c6', abbr: 'TS'  },
  { name: 'Python',     color: '#3776ab', abbr: 'Py'  },
  { name: 'Go',         color: '#00add8', abbr: 'Go'  },
  { name: 'Rust',       color: '#ce422b', abbr: 'Rs'  },
  { name: 'Java',       color: '#ed8b00', abbr: 'Jv'  },
  { name: 'C#',         color: '#9b4f96', abbr: 'C#'  },
  { name: 'PHP',        color: '#777bb4', abbr: 'PHP' },
  { name: 'Ruby',       color: '#cc342d', abbr: 'Rb'  },
  { name: 'C++',        color: '#00599c', abbr: 'C++' },
];

export const EXPERIENCE_OPTIONS = [
  { value: '< 1 year',  label: '< 1 Year',  subtext: 'Just getting started', icon: '🌱' },
  { value: '1-2 years', label: '1–2 Years', subtext: 'Building confidence',  icon: '🔨' },
  { value: '3-5 years', label: '3–5 Years', subtext: 'Solid foundation',     icon: '⚡' },
  { value: '5+ years',  label: '5+ Years',  subtext: 'Battle-tested',        icon: '🚀' },
];

export const OSS_OPTIONS = [
  { value: 'never',         label: 'Never'         },
  { value: 'once or twice', label: 'Once or twice' },
  { value: 'regularly',     label: 'Regularly'     },
];

export const INTERESTS = [
  { value: 'Web Development',       emoji: '🌐' },
  { value: 'AI & Machine Learning', emoji: '🤖' },
  { value: 'Developer Tools',       emoji: '🛠️' },
  { value: 'Mobile',                emoji: '📱' },
  { value: 'CLI & Terminal',        emoji: '⌨️' },
  { value: 'Documentation',         emoji: '📚' },
  { value: 'Testing',               emoji: '🧪' },
  { value: 'Databases',             emoji: '🗄️' },
  { value: 'Security',              emoji: '🔒' },
  { value: 'Cloud & DevOps',        emoji: '☁️' },
];

export const GOALS = [
  {
    value:       'Learn New Technologies',
    icon:        '📖',
    title:       'Learn New Technologies',
    description: 'Explore codebases and pick up new skills through real-world projects',
  },
  {
    value:       'Boost My Resume',
    icon:        '💼',
    title:       'Boost My Resume',
    description: 'Add meaningful open source contributions to stand out to employers',
  },
  {
    value:       'Give Back to the Community',
    icon:        '🤝',
    title:       'Give Back to the Community',
    description: 'Help maintain projects you use and love every day',
  },
  {
    value:       'All of the Above',
    icon:        '🎯',
    title:       'All of the Above',
    description: "I'm here for the full experience",
  },
];

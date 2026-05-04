export const LEVEL_CONFIG = {
  1: {
    stars: { min: 200, max: 3000 },
    label: 'good first issue',
    maxRepoSize: 8000,
    minIssues: 3,
  },
  2: {
    stars: { min: 500, max: 8000 },
    label: 'good first issue',
    maxRepoSize: 15000,
    minIssues: 2,
  },
  3: {
    stars: { min: 1000, max: 20000 },
    label: 'good first issue',
    maxRepoSize: 30000,
    minIssues: 1,
  },
  4: {
    stars: { min: 5000, max: 50000 },
    label: 'help wanted',
    maxRepoSize: 60000,
    minIssues: 1,
  },
  5: {
    stars: { min: 10000, max: 200000 },
    label: 'help wanted',
    maxRepoSize: 999999,
    minIssues: 1,
  },
};

export const INTEREST_TOPICS: Record<string, string[]> = {
  'Web Development':  ['web', 'frontend', 'css', 'html', 'api', 'rest'],
  'AI & ML':          ['machine-learning', 'ai', 'nlp', 'deep-learning', 'llm'],
  'Developer Tools':  ['cli', 'developer-tools', 'productivity', 'devtools'],
  'Mobile':           ['android', 'ios', 'flutter', 'react-native', 'mobile'],
  'CLI & Terminal':   ['cli', 'terminal', 'shell', 'command-line'],
  'Documentation':    ['documentation', 'docs', 'writing', 'technical-writing'],
  'Testing':          ['testing', 'test', 'e2e', 'unit-testing', 'jest'],
  'Databases':        ['database', 'sql', 'postgresql', 'orm', 'mongodb'],
  'Security':         ['security', 'cryptography', 'auth', 'oauth'],
  'Cloud & DevOps':   ['devops', 'docker', 'kubernetes', 'cloud', 'ci-cd'],
};

// Mapiranje iskustva na level (1-5)
export const EXPERIENCE_LEVEL_MAP: Record<string, Record<string, number>> = {
  '< 1 Year': {
    'Never':          1,
    'Once or twice':  2,
    'Regularly':      2,
  },
  '1-2 Years': {
    'Never':          2,
    'Once or twice':  3,
    'Regularly':      3,
  },
  '3-5 Years': {
    'Never':          3,
    'Once or twice':  4,
    'Regularly':      4,
  },
  '5+ Years': {
    'Never':          4,
    'Once or twice':  5,
    'Regularly':      5,
  },
};
// Replace with: GET /api/dashboard?userId={id}

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
  language: string;
  size: number;
  topics: string[];
  has_wiki: boolean;
  license: { name: string };
};

export type Issue = {
  id: number;
  title: string;
  html_url: string;
  labels: { name: string }[];
  created_at: string;
};

export type Recommendation = {
  repo: Repo;
  score: number;
  match_percentage: number;
  issues: Issue[];
};

export type Stats = {
  repos_viewed: number;
  issues_clicked: number;
  days_streak: number;
  achievements: string[];
};

export type TrendingRepo = {
  name: string;
  stars: number;
  language: string;
  match_percentage: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type RecentlyViewedRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  language: string;
  updated_at: string;
};

export const mockRecommendations: Recommendation[] = [
  {
    repo: {
      id: 1,
      name: 'valibot',
      full_name: 'fabian-hiller/valibot',
      description: 'The modular and type-safe schema library for validating structural data',
      html_url: 'https://github.com/fabian-hiller/valibot',
      stargazers_count: 5800,
      open_issues_count: 23,
      updated_at: '2024-01-14T10:00:00Z',
      language: 'TypeScript',
      size: 4200,
      topics: ['validation', 'typescript', 'schema'],
      has_wiki: false,
      license: { name: 'MIT' },
    },
    score: 87,
    match_percentage: 94,
    issues: [
      {
        id: 1,
        title: 'Add support for custom error messages in nested schemas',
        html_url: 'https://github.com/fabian-hiller/valibot/issues/1',
        labels: [{ name: 'good first issue' }],
        created_at: '2024-01-10T10:00:00Z',
      },
      {
        id: 2,
        title: 'Improve TypeScript types documentation',
        html_url: 'https://github.com/fabian-hiller/valibot/issues/2',
        labels: [{ name: 'documentation' }],
        created_at: '2024-01-09T10:00:00Z',
      },
    ],
  },
  {
    repo: {
      id: 2,
      name: 'happy-dom',
      full_name: 'capricorn86/happy-dom',
      description: 'A JavaScript implementation of a web browser without its graphical user interface',
      html_url: 'https://github.com/capricorn86/happy-dom',
      stargazers_count: 3200,
      open_issues_count: 41,
      updated_at: '2024-01-13T10:00:00Z',
      language: 'TypeScript',
      size: 6800,
      topics: ['testing', 'dom', 'javascript', 'web'],
      has_wiki: true,
      license: { name: 'MIT' },
    },
    score: 82,
    match_percentage: 91,
    issues: [
      {
        id: 3,
        title: 'Fix HTMLInputElement value not updating on programmatic change',
        html_url: 'https://github.com/capricorn86/happy-dom/issues/3',
        labels: [{ name: 'good first issue' }],
        created_at: '2024-01-11T10:00:00Z',
      },
    ],
  },
  {
    repo: {
      id: 3,
      name: 'ofetch',
      full_name: 'unjs/ofetch',
      description: 'A better fetch API. Works on node, browser and workers',
      html_url: 'https://github.com/unjs/ofetch',
      stargazers_count: 4100,
      open_issues_count: 18,
      updated_at: '2024-01-12T10:00:00Z',
      language: 'TypeScript',
      size: 2100,
      topics: ['fetch', 'api', 'web', 'javascript'],
      has_wiki: false,
      license: { name: 'MIT' },
    },
    score: 79,
    match_percentage: 88,
    issues: [
      {
        id: 4,
        title: 'Add retry configuration documentation',
        html_url: 'https://github.com/unjs/ofetch/issues/4',
        labels: [{ name: 'documentation' }],
        created_at: '2024-01-08T10:00:00Z',
      },
      {
        id: 5,
        title: 'Support for request timeout option',
        html_url: 'https://github.com/unjs/ofetch/issues/5',
        labels: [{ name: 'good first issue' }],
        created_at: '2024-01-07T10:00:00Z',
      },
    ],
  },
  {
    repo: {
      id: 4,
      name: 'rspack',
      full_name: 'web-infra-dev/rspack',
      description: 'The fast Rust-based web bundler with webpack-compatible API',
      html_url: 'https://github.com/web-infra-dev/rspack',
      stargazers_count: 7800,
      open_issues_count: 156,
      updated_at: '2024-01-14T10:00:00Z',
      language: 'Rust',
      size: 45000,
      topics: ['bundler', 'rust', 'webpack', 'developer-tools'],
      has_wiki: false,
      license: { name: 'MIT' },
    },
    score: 74,
    match_percentage: 85,
    issues: [
      {
        id: 6,
        title: 'Improve error output for missing module resolution',
        html_url: 'https://github.com/web-infra-dev/rspack/issues/6',
        labels: [{ name: 'good first issue' }],
        created_at: '2024-01-12T10:00:00Z',
      },
    ],
  },
  {
    repo: {
      id: 5,
      name: 'elysia',
      full_name: 'elysiajs/elysia',
      description: 'Ergonomic Framework for Humans — fast and friendly Bun web framework',
      html_url: 'https://github.com/elysiajs/elysia',
      stargazers_count: 6200,
      open_issues_count: 67,
      updated_at: '2024-01-13T10:00:00Z',
      language: 'TypeScript',
      size: 5600,
      topics: ['web', 'api', 'bun', 'typescript', 'framework'],
      has_wiki: false,
      license: { name: 'MIT' },
    },
    score: 71,
    match_percentage: 82,
    issues: [
      {
        id: 7,
        title: 'Add missing JSDoc comments to core functions',
        html_url: 'https://github.com/elysiajs/elysia/issues/7',
        labels: [{ name: 'good first issue' }],
        created_at: '2024-01-11T10:00:00Z',
      },
      {
        id: 8,
        title: 'Plugin system documentation improvements',
        html_url: 'https://github.com/elysiajs/elysia/issues/8',
        labels: [{ name: 'documentation' }],
        created_at: '2024-01-10T10:00:00Z',
      },
    ],
  },
];

export const mockStats: Stats = {
  repos_viewed: 12,
  issues_clicked: 5,
  days_streak: 3,
  achievements: ['first_look', 'explorer'],
};

export const mockTrending: TrendingRepo[] = [
  { name: 'biomejs/biome', stars: 12400, language: 'Rust', match_percentage: 78 },
  { name: 'shadcn-ui/ui', stars: 54000, language: 'TypeScript', match_percentage: 71 },
  { name: 'vercel/next.js', stars: 118000, language: 'TypeScript', match_percentage: 65 },
  { name: 'vitejs/vite', stars: 64000, language: 'TypeScript', match_percentage: 61 },
  { name: 'nickvdyck/nightwatch', stars: 1800, language: 'JavaScript', match_percentage: 58 },
];

export const mockAchievements: Achievement[] = [
  { id: 'first_look', name: 'First Look', description: 'Viewed your first repository', icon: '🌱', unlocked: true },
  { id: 'explorer', name: 'Explorer', description: 'Viewed 10 repositories', icon: '🔍', unlocked: true },
  { id: 'committed', name: 'Committed', description: '7 day streak', icon: '⭐', unlocked: false },
  { id: 'issue_hunter', name: 'Issue Hunter', description: 'Clicked on 5 issues', icon: '🎯', unlocked: false },
  { id: 'contributor', name: 'Contributor', description: 'Clicked on 20 issues', icon: '🚀', unlocked: false },
];

export const mockRecentlyViewed: RecentlyViewedRepo[] = [
  {
    id: 10,
    name: 'zod',
    full_name: 'colinhacks/zod',
    html_url: 'https://github.com/colinhacks/zod',
    language: 'TypeScript',
    updated_at: '2024-01-14T06:00:00Z',
  },
  {
    id: 11,
    name: 'hono',
    full_name: 'honojs/hono',
    html_url: 'https://github.com/honojs/hono',
    language: 'TypeScript',
    updated_at: '2024-01-13T15:00:00Z',
  },
  {
    id: 12,
    name: 'effect',
    full_name: 'effect-ts/effect',
    html_url: 'https://github.com/effect-ts/effect',
    language: 'TypeScript',
    updated_at: '2024-01-13T05:00:00Z',
  },
];

export interface GithubIssue {
  id: number;
  title: string;
  html_url: string;
  labels: { name: string }[];
  created_at: string;
}

export interface GithubRepo {
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
  license: { name: string } | null;
}

export interface ScoredRepo {
  repo: GithubRepo;
  score: number;
  match_percentage: number;
  issues: GithubIssue[];
}

export interface ExploreResult {
  forYou: ScoredRepo[];
  trendingByLanguage: { language: string; repos: ScoredRepo[] }[];
  topicRepos: ScoredRepo[];
  exploreNew: ScoredRepo | null;
  total: number;
  page: number;
  totalPages: number;
}

export type SortOption = 'updated' | 'stars' | 'issues';

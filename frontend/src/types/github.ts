export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
  language: string;
}

export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  labels: { name: string }[];
  created_at: string;
}

export interface RepoRecommendation {
  repo: GitHubRepo;
  score: number;
  issues: GitHubIssue[];
}

export type SkillLevel = 'beginner' | 'help wanted';

export interface SearchParams {
  language: string;
  level: SkillLevel;
}

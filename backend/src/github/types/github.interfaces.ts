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
}

export interface GithubIssue {
  id: number;
  title: string;
  html_url: string;
  labels: { name: string }[];
  created_at: string;
}

export interface RepoRecommendation {
  repo: GithubRepo;
  score: number;
  issues: GithubIssue[];  
}
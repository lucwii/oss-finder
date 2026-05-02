export interface DailyRecommendation {
  repo: {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
    open_issues_count: number;
    updated_at: string;
  };
  score: number;
  match_percentage: number;
  issues: {
    id: number;
    title: string;
    html_url: string;
    labels: { name: string }[];
  }[];
}

export interface UserStats {
  user_id: string;
  repos_viewed: number;
  issues_clicked: number;
  days_streak: number;
  last_active_date: string;
  achievements: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface DashboardData {
  recommendations: DailyRecommendation[];
  trending: DailyRecommendation[];
  stats: UserStats;
  achievements: Achievement[];
  recently_viewed: DailyRecommendation[];
}
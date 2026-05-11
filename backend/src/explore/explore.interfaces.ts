import type { ScoredRepo } from '../github/types/github.interfaces';

export interface ExploreQuery {
  topic?: string;
  language?: string;
  page?: number;
  limit?: number;
  sort?: 'updated' | 'stars' | 'issues';
}

export interface ExploreResult {
  forYou: ScoredRepo[];
  trendingByLanguage: {
    language: string;
    repos: ScoredRepo[];
  }[];
  topicRepos: ScoredRepo[];
  exploreNew: ScoredRepo | null;
  total: number;
  page: number;
  totalPages: number;
}

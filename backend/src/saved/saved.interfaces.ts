export interface SaveRepoDto {
  repo_id: number;
  repo_data: {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    open_issues_count: number;
    language: string;
    topics: string[];
  };
  collection_id?: string;
}

export interface UpdateRepoStatusDto {
  status: 'want_to_contribute' | 'in_progress' | 'completed';
}

export interface MoveToCollectionDto {
  collection_id: string | null;
}

export interface CreateCollectionDto {
  name: string;
}

export interface SavedRepo {
  id: string;
  repo_id: number;
  repo_data: any;
  status: string;
  collection_id: string | null;
  collection_name: string | null;
  saved_at: string;
}

export interface Collection {
  id: string;
  name: string;
  count: number;
  isDefault: boolean;
  created_at?: string;
}

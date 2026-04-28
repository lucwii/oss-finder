import type { RepoRecommendation, SearchParams } from '@/types/github';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchRecommendations(
  params: SearchParams,
): Promise<RepoRecommendation[]> {
  const url = new URL(`${API_BASE}/github/recommendations`);
  url.searchParams.set('language', params.language);
  url.searchParams.set('level', params.level);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

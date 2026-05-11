import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OnboardingService } from '../onboarding/onboarding.service';
import { SupabaseService } from '../supabase/supabase.service';
import {
  EXPERIENCE_LEVEL_MAP,
  INTEREST_TOPICS,
  LEVEL_CONFIG,
} from '../github/constants/github.constants';
import type { GithubRepo, ScoredRepo } from '../github/types/github.interfaces';
import type { UserProfile } from '../onboarding/types/onboarding.interfaces';
import type { ExploreQuery, ExploreResult } from './explore.interfaces';

const ALL_LANGUAGES = [
  'javascript', 'typescript', 'python', 'go',
  'rust', 'java', 'csharp', 'php', 'ruby', 'cpp',
];

const GITHUB_HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

@Injectable()
export class ExploreService {
  private readonly logger = new Logger(ExploreService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly onboardingService: OnboardingService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getExploreData(userId: string, query: ExploreQuery): Promise<ExploreResult> {
    let profile: UserProfile;
    try {
      profile = await this.onboardingService.getProfile(userId);
    } catch {
      throw new NotFoundException('Complete onboarding first');
    }

    const limit = query.limit ?? 10;
    const page  = query.page  ?? 1;

    const [forYou, trendingByLanguage, topicRepos, exploreNew] = await Promise.all([
      this.getForYou(userId, profile),
      this.getTrendingByLanguage(profile.languages),
      this.getTopicRepos(profile, query.topic, page, limit),
      this.getExploreNew(profile),
    ]);

    return {
      forYou,
      trendingByLanguage,
      topicRepos,
      exploreNew,
      total: topicRepos.length,
      page,
      totalPages: Math.ceil(topicRepos.length / limit),
    };
  }

  async getTopics(userId: string): Promise<{ topics: string[]; languages: string[] }> {
    let profile: UserProfile;
    try {
      profile = await this.onboardingService.getProfile(userId);
    } catch {
      throw new NotFoundException('Complete onboarding first');
    }
    return { topics: profile.interests, languages: profile.languages };
  }

  // ── For You ──────────────────────────────────────────────────────────────────

  private async getForYou(userId: string, profile: UserProfile): Promise<ScoredRepo[]> {
    const cacheKey = `explore-foryou-${userId}`;
    const supabase = this.supabaseService.getdb();

    const { data: cached } = await supabase
      .from('explore_cache')
      .select('data, expires_at')
      .eq('user_id', userId)
      .eq('cache_key', cacheKey)
      .single();

    if (cached && new Date(cached.expires_at) > new Date()) {
      this.logger.log(`Cache hit: explore forYou for ${userId}`);
      return cached.data as ScoredRepo[];
    }

    const level  = this.calculateLevel(profile.experience_years, profile.open_source_experience);
    const config = LEVEL_CONFIG[level];

    const lang     = profile.languages[Math.floor(Math.random() * profile.languages.length)];
    const interest = profile.interests[Math.floor(Math.random() * profile.interests.length)];
    const topics   = INTEREST_TOPICS[interest] ?? [];

    const topicPart = topics.length > 0 ? ` topic:${topics[0]}` : '';
    const q = `language:${lang} stars:${config.stars.min}..${config.stars.max} good-first-issues:>=2 is:public archived:false${topicPart}`;

    const repos  = await this.searchRepos(q, 'updated', 10);
    const scored = this.scoreRepos(repos, level, profile.interests);
    const diverse = this.applyDiversityFilter(scored, 2, 2);

    // Different seed from daily picks so results feel fresh
    const today = new Date().toISOString().split('T')[0];
    const seed  = `${userId}-explore-${today}`;
    const picks = this.deterministicPick(diverse, seed, 4);

    const result: ScoredRepo[] = picks.map(({ repo, score }) => ({
      repo,
      score,
      match_percentage: this.scoreToPercentage(score),
      issues: [],
    }));

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('explore_cache')
      .upsert({ user_id: userId, cache_key: cacheKey, data: result, expires_at: expiresAt });

    return result;
  }

  // ── Trending by language ──────────────────────────────────────────────────────

  private async getTrendingByLanguage(
    languages: string[],
  ): Promise<{ language: string; repos: ScoredRepo[] }[]> {
    const langs = languages.slice(0, 3);

    const results = await Promise.all(
      langs.map(async (lang) => {
        try {
          const q = `language:${lang} stars:>1000 is:public archived:false`;
          const repos = await this.searchRepos(q, 'updated', 5);
          return {
            language: lang,
            repos: repos.slice(0, 3).map((repo) => ({
              repo,
              score: 0,
              match_percentage: 0,
              issues: [],
            })),
          };
        } catch (err: any) {
          this.logger.error(`getTrendingByLanguage failed for ${lang}:`, err.message);
          return { language: lang, repos: [] };
        }
      }),
    );

    return results;
  }

  // ── Topic repos ───────────────────────────────────────────────────────────────

  private async getTopicRepos(
    profile: UserProfile,
    topic: string | undefined,
    page: number,
    limit: number,
  ): Promise<ScoredRepo[]> {
    try {
      const level  = this.calculateLevel(profile.experience_years, profile.open_source_experience);
      const config = LEVEL_CONFIG[level];

      let keywords: string[] = [];
      if (topic && INTEREST_TOPICS[topic]) {
        keywords = INTEREST_TOPICS[topic];
      } else {
        keywords = profile.interests.flatMap((i) => INTEREST_TOPICS[i] ?? []);
      }

      const topicPart = keywords.length > 0 ? ` topic:${keywords[0]}` : '';
      const lang = profile.languages[0];
      const q = `language:${lang} stars:${config.stars.min}..${config.stars.max} good-first-issues:>=1 is:public archived:false${topicPart}`;

      const repos  = await this.searchRepos(q, 'updated', 30);
      const scored = this.scoreRepos(repos, level, profile.interests);

      const start = (page - 1) * limit;
      return scored.slice(start, start + limit).map(({ repo, score }) => ({
        repo,
        score,
        match_percentage: this.scoreToPercentage(score),
        issues: [],
      }));
    } catch (err: any) {
      this.logger.error('getTopicRepos failed:', err.message);
      return [];
    }
  }

  // ── Explore new language ──────────────────────────────────────────────────────

  private async getExploreNew(profile: UserProfile): Promise<ScoredRepo | null> {
    try {
      const userLangs = profile.languages.map((l) => l.toLowerCase());
      const newLangs  = ALL_LANGUAGES.filter((l) => !userLangs.includes(l));
      if (newLangs.length === 0) return null;

      const lang = newLangs[Math.floor(Math.random() * newLangs.length)];
      const q    = `language:${lang} stars:1000..10000 good-first-issues:>=3 is:public archived:false`;

      const repos = await this.searchRepos(q, 'updated', 5);
      if (repos.length === 0) return null;

      const scored = this.scoreRepos(repos, 2, []);
      const top    = scored[0];

      return {
        repo: top.repo,
        score: top.score,
        match_percentage: this.scoreToPercentage(top.score),
        issues: [],
      };
    } catch (err: any) {
      this.logger.error('getExploreNew failed:', err.message);
      return null;
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────────

  private async searchRepos(q: string, sort: string, perPage: number): Promise<GithubRepo[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.github.com/search/repositories', {
          params: { q, sort, order: 'desc', per_page: perPage },
          headers: GITHUB_HEADERS,
        }),
      );
      return response.data.items ?? [];
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403 || status === 429) {
        this.logger.error('GitHub rate limit hit');
        throw new HttpException('Try again later', HttpStatus.TOO_MANY_REQUESTS);
      }
      this.logger.error('GitHub search failed:', err.message);
      return [];
    }
  }

  private calculateLevel(experienceYears: string, openSourceExp: string): number {
    return EXPERIENCE_LEVEL_MAP[experienceYears]?.[openSourceExp] ?? 2;
  }

  // TODO: extract to shared util — duplicated from GithubService
  private scoreRepos(
    repos: GithubRepo[],
    level: number,
    interests: string[],
  ): { repo: GithubRepo; score: number }[] {
    const config = LEVEL_CONFIG[level];

    return repos
      .map((repo) => {
        let score = 0;

        const days = this.getDaysSince(repo.updated_at);
        if (days < 7)       score += 40;
        else if (days < 14) score += 30;
        else if (days < 30) score += 20;
        else if (days < 60) score += 10;

        const { min, max } = config.stars;
        const stars = repo.stargazers_count;
        if (stars >= min && stars <= max) score += 30;
        else if (stars < min)             score += 5;
        else if (stars <= max * 1.5)      score += 15;
        else                              score += 2;

        score += Math.min(repo.open_issues_count * 2, 20);

        const sizeRatio = repo.size / config.maxRepoSize;
        if (sizeRatio < 0.2)      score += 15;
        else if (sizeRatio < 0.5) score += 10;
        else if (sizeRatio < 0.8) score += 5;

        if (interests.length > 0) {
          const repoTopics     = repo.topics ?? [];
          const relevantTopics = interests.flatMap((i) => INTEREST_TOPICS[i] ?? []);
          const matches = repoTopics.filter((t) => relevantTopics.includes(t)).length;
          score += Math.min(matches * 7, 20);
        }

        if (repo.description) score += 4;
        if (repo.has_wiki)    score += 3;
        if (repo.license)     score += 3;

        return { repo, score };
      })
      .sort((a, b) => b.score - a.score);
  }

  // TODO: extract to shared util — duplicated from GithubService
  private applyDiversityFilter(
    scored: { repo: GithubRepo; score: number }[],
    maxPerLanguage = 2,
    maxPerInterest = 2,
  ): { repo: GithubRepo; score: number }[] {
    const langCount:     Record<string, number> = {};
    const interestCount: Record<string, number> = {};
    const result: { repo: GithubRepo; score: number }[] = [];

    for (const item of scored) {
      const lang = item.repo.language ?? 'unknown';
      if ((langCount[lang] ?? 0) >= maxPerLanguage) continue;

      const detectedInterest = this.detectInterest(item.repo.topics ?? []);
      if (detectedInterest && (interestCount[detectedInterest] ?? 0) >= maxPerInterest) continue;

      result.push(item);
      langCount[lang] = (langCount[lang] ?? 0) + 1;
      if (detectedInterest) {
        interestCount[detectedInterest] = (interestCount[detectedInterest] ?? 0) + 1;
      }
    }

    return result;
  }

  private detectInterest(topics: string[]): string | null {
    for (const [interest, keywords] of Object.entries(INTEREST_TOPICS)) {
      if (topics.some((t) => keywords.includes(t))) return interest;
    }
    return null;
  }

  private deterministicPick(
    pool: { repo: GithubRepo; score: number }[],
    seed: string,
    count: number,
  ): { repo: GithubRepo; score: number }[] {
    const shuffled = [...pool].sort((a, b) => {
      const hashA = this.hashString(`${seed}-${a.repo.id}`);
      const hashB = this.hashString(`${seed}-${b.repo.id}`);
      return hashA - hashB;
    });
    return shuffled.slice(0, count);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private getDaysSince(dateString: string): number {
    return Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  private scoreToPercentage(score: number): number {
    return Math.min(99, Math.max(70, Math.round(score * 0.7 + 25)));
  }
}

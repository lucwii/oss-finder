import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { GithubIssue, GithubRepo, RepoRecommendation, ScoredRepo } from './types/github.interfaces';
import { first, firstValueFrom } from 'rxjs';
import { OnboardingService } from 'src/onboarding/onboarding.service';
import { EXPERIENCE_LEVEL_MAP, INTEREST_TOPICS, LEVEL_CONFIG } from './constants/github.constants';

@Injectable()
export class GithubService {
    private readonly logger = new Logger(GithubService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly onboardingService: OnboardingService
    ) {}


    // MAIN METHOD: Get top repo recommendations based on language and difficulty level
    async getRecommendations(language: string, level: string): Promise<RepoRecommendation[]> {
        const repos = await this.fetchRepositories(language);

        const scored = this.scoreRepositories(repos);

        const topRepos = scored.slice(0, 10);

        const githubLabel = level === 'beginner' ? 'good first issue' : 'help wanted';
        const recommendations = await Promise.all(
            topRepos.map(async ({repo, score}) => {
                const issues = await this.fetchIssues(repo.full_name, githubLabel);
                return { repo, score, issues };
            })
        );
        return recommendations;
    }

    // Repo fetching method
    private async fetchRepositories(language: string): Promise<GithubRepo[]> {
        const query = `language:${language} good-first-issues:>2 stars:>50`;
        
        const response = await firstValueFrom(
            this.httpService.get('https://api.github.com/search/repositories', {
                params: {
                    q: query,
                    sort: 'updated',
                    order: 'desc',
                    per_page: 30
                },
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            })
        )
        return response.data.items;
    }

    // Repo scoring algorithm based on:
    // - Recency of updates (more recent = higher score)
    // - Number of open issues (more issues = higher score, but with diminishing returns)
    // - Number of stars (more stars = higher score, but with diminishing returns)
    // - Presence of a description (has description = +5 points)
    private scoreRepositories(repos: GithubRepo[]): {repo: GithubRepo, score: number}[] {
        const scored = repos.map((repo) => {
            let score = 0;

            const daysSinceUpdate = this.getDaysSince(repo.updated_at);
            if(daysSinceUpdate < 7) score += 40;
            else if(daysSinceUpdate < 30) score += 20;
            else score += 5;

            if(repo.open_issues_count > 50) score += 20;
            else if(repo.open_issues_count > 10) score += 10;

            score += Math.min(Math.min(repo.stargazers_count / 1000), 20); 
            
            if(repo.description) score += 5;

            return {repo, score};
        })

        return scored.sort((a, b) => b.score - a.score);
    }


    // Issues fetching method for a given repo and GitHub label string
    private async fetchIssues(fullName: string, label: string): Promise<GithubIssue[]> {
        const response = await firstValueFrom(
            this.httpService.get(`https://api.github.com/search/issues`, {
                params: {
                    q: `repo:${fullName} label:"${label}" state:open`,
                    per_page: 3
                },
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            })
        )

        return response.data.items;
    }


    // Helper method to calculate days since a given date
    private getDaysSince(dateString: string): number {
        const date = new Date(dateString);
        const now = new Date();

        return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    }




    //Personalized methods (private methods and the main algorithm)


    private calculateLevel(
        experienceYears: string,
        openSourceExp: string
    ): number {
        return EXPERIENCE_LEVEL_MAP[experienceYears]?.[openSourceExp] ?? 2;
    }

    private async fetchForLanguageAndLevel(
        language: string,
        stars: {min: number, max: number},
        minIssues: number
    ): Promise<GithubRepo[]> {
        try {
            const query = [
            `language:${language}`,
            `stars:${stars.min}..${stars.max}`,
            `good-first-issues:>=${minIssues}`,
            'is:public',
            'archived:false',
            ].join(' ');

            const response = await firstValueFrom(
            this.httpService.get('https://api.github.com/search/repositories', {
                params: {
                q: query,
                sort: 'updated',
                order: 'desc',
                per_page: 30,
                },
                headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
                },
            }),
            );

            return response.data.items ?? [];
        } catch (error: any) {
            this.logger.error(
            `Failed to fetch repos for ${language}:`,
            error.message,
            );
            return [];
        }
    }

    private async fetchPersonalizedRepositories(languages: string[], level: number): Promise<GithubRepo[]> {
        const config = LEVEL_CONFIG[level];

        const results = await Promise.all(
            languages.map((lang) => 
            this.fetchForLanguageAndLevel(lang, config.stars, config.minIssues)
            )
        );

        const allRepos = results.flat();
        const unique = allRepos.filter(
            (repo, index, self) =>
            index === self.findIndex((r) => r.id === repo.id)
        )

        return unique;
    }

    private filterRepos(
        repos: GithubRepo[],
        config: (typeof LEVEL_CONFIG)[keyof typeof LEVEL_CONFIG]
    ): GithubRepo[] {
        return repos.filter((repo) => {
            if(!repo.description) return false;

            if(repo.size > config.maxRepoSize) return false;

            if(this.getDaysSince(repo.updated_at) > 90) return false;

            return true;
        })
    }


    private scorePersonalized(
    repos: GithubRepo[],
    level: number,
    interests: string[],
    ): { repo: GithubRepo; score: number }[] {
    const config = LEVEL_CONFIG[level];

    const scored = repos.map((repo) => {
        let score = 0;

        // 1. AKTIVNOST (0-40 poena)
        const days = this.getDaysSince(repo.updated_at);
        if (days < 7)       score += 40;
        else if (days < 14) score += 30;
        else if (days < 30) score += 20;
        else if (days < 60) score += 10;

        // 2. SWEET SPOT ZVEZDICE (0-30 poena)
        // Nagrađujemo repoe koji su u idealnom opsegu za korisnikov level
        const { min, max } = config.stars;
        const stars = repo.stargazers_count;
        if (stars >= min && stars <= max)  score += 30; // savršen fit
        else if (stars < min)              score += 5;  // premali
        else if (stars <= max * 1.5)       score += 15; // malo veći, ok
        else                               score += 2;  // previše poznat

        // 3. BROJ ISSUES (0-20 poena)
        score += Math.min(repo.open_issues_count * 2, 20);

        // 4. VELIČINA REPOA (0-15 poena)
        // Manji codebase = lakše za navigaciju kao početnik
        const sizeRatio = repo.size / config.maxRepoSize;
        if (sizeRatio < 0.2)      score += 15;
        else if (sizeRatio < 0.5) score += 10;
        else if (sizeRatio < 0.8) score += 5;

        // 5. POKLAPANJE SA INTERESOVANJIMA (0-20 poena)
        if (interests && interests.length > 0) {
        const repoTopics = repo.topics ?? [];
        const relevantTopics = interests.flatMap(
            (i) => INTEREST_TOPICS[i] ?? [],
        );
        const matches = repoTopics.filter((t) =>
            relevantTopics.includes(t),
        ).length;
        score += Math.min(matches * 7, 20);
        }

        // 6. DOKUMENTACIJA (0-10 poena)
        if (repo.description) score += 4;
        if (repo.has_wiki)    score += 3;
        if (repo.license)     score += 3;

        return { repo, score };
    });

    return scored.sort((a, b) => b.score - a.score);
    }

    private applyDiversityFilter(
  scored: { repo: GithubRepo; score: number }[],
  maxPerLanguage = 3,
  maxPerInterest = 2,
): { repo: GithubRepo; score: number }[] {
  const languageCount: Record<string, number> = {};
  const interestCount: Record<string, number> = {};
  const result: { repo: GithubRepo; score: number }[] = [];

  for (const item of scored) {
    const lang = item.repo.language ?? 'unknown';

    // Preskoči ako smo već uzeli dovoljno repoa za ovaj jezik
    if ((languageCount[lang] ?? 0) >= maxPerLanguage) continue;

    // Preskoči ako smo već uzeli dovoljno repoa za ovu oblast
    const detectedInterest = this.detectInterest(item.repo.topics ?? []);
    if (
      detectedInterest &&
      (interestCount[detectedInterest] ?? 0) >= maxPerInterest
    ) continue;

    result.push(item);
    languageCount[lang] = (languageCount[lang] ?? 0) + 1;
    if (detectedInterest) {
      interestCount[detectedInterest] =
        (interestCount[detectedInterest] ?? 0) + 1;
    }
  }

  return result;
}

    private detectInterest(topics: string[]): string | null {
        for (const [interest, keywords] of Object.entries(INTEREST_TOPICS)) {
            if (topics.some((t) => keywords.includes(t))) {
            return interest;
            }
        }
        return null;
    }

    private getDailyPicks(
  pool: { repo: GithubRepo; score: number }[],
  userId: string,
  count: number,
): { repo: GithubRepo; score: number }[] {
  const today = new Date().toISOString().split('T')[0];
  const seed = `${userId}-${today}`;

  // Deterministički shuffle — isti seed uvek daje isti redosled
  // Tako korisnik dobija iste repoe tokom dana, ali drugačije sutra
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

private scoreToPercentage(score: number): number {
  // Mapiramo score na 70-99% da uvek izgleda relevantno
  return Math.min(99, Math.max(70, Math.round(score * 0.7 + 25)));
}



    async getPersonalizedRecommendations(userId: string): Promise<ScoredRepo[]> {
  const profile = await this.onboardingService.getProfile(userId);
  this.logger.log(`Profile languages: ${profile.languages}, level exp: ${profile.experience_years}, os exp: ${profile.open_source_experience}`);

  const level = this.calculateLevel(
    profile.experience_years,
    profile.open_source_experience,
  );
  this.logger.log(`Calculated level: ${level}`);

  const config = LEVEL_CONFIG[level];

  const repos = await this.fetchPersonalizedRepositories(profile.languages, level);
  this.logger.log(`Fetched ${repos.length} repos from GitHub`);

  const filtered = this.filterRepos(repos, config);
  this.logger.log(`After filterRepos: ${filtered.length} repos`);

  const scored = this.scorePersonalized(filtered, level, profile.interests);
  const diverse = this.applyDiversityFilter(scored);
  this.logger.log(`After diversity filter: ${diverse.length} repos`);

  const pool = diverse.slice(0, 30);
  const daily = this.getDailyPicks(pool, userId, 8);
  this.logger.log(`Daily picks: ${daily.length} repos`);

  return Promise.all(
    daily.map(async ({ repo, score }) => ({
      repo,
      score,
      match_percentage: this.scoreToPercentage(score),
      issues: await this.fetchIssues(repo.full_name, config.label),
    })),
  );
}

}

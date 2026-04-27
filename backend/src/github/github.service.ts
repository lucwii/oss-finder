import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GithubIssue, GithubRepo, RepoRecommendation } from './types/github.interfaces';
import { first, firstValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
    constructor(private readonly httpService: HttpService) {}


    // MAIN METHOD: Get top repo recommendations based on language and difficulty level
    async getRecommendations(language: string, level: string): Promise<RepoRecommendation[]> {
        const repos = await this.fetchRepositories(language);

        const scored = this.scoreRepositories(repos);

        const topRepos = scored.slice(0, 10);

        const recommendations = await Promise.all(
            topRepos.map(async ({repo, score}) => {
                const issues = await this.fetchIssues(repo.full_name, level);
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


    // Issues fetching method for a given repo and difficulty level
    private async fetchIssues(fullName: string, level: string): Promise<GithubIssue[]> {
        const label = level === 'beginner' ? 'good first issue' : 'help wanted';

        const response = await firstValueFrom(
            await this.httpService.get(`https://api.github.com/search/issues`, {
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
}

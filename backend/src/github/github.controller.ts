import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @Get('recommendations')
    async getRecommendations(
        @Query('language') language: string,
        @Query('level') level: string
    ) {
        return this.githubService.getRecommendations(language, level);
    }
}

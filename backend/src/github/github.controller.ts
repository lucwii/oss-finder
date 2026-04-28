import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('recommendations')
  async getRecommendations(
    @Query('language') language: string,
    @Query('level') level: string,
  ) {
    return this.githubService.getRecommendations(language, level);
  }

  @UseGuards(AuthGuard)
  @Get('recommendations/personalized')
  async getPersonalizedRecommendations(
    @Query('language') language: string,
    @Query('level') level: string,
  ) {
    return this.githubService.getRecommendations(language, level);
  }
}

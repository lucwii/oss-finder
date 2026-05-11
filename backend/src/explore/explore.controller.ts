import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ExploreService } from './explore.service';
import type { ExploreQuery } from './explore.interfaces';

@Controller('explore')
@UseGuards(AuthGuard)
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get()
  getExploreData(
    @Request() req: { user: { id: string } },
    @Query('topic') topic?: string,
    @Query('language') language?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: ExploreQuery['sort'],
  ) {
    const query: ExploreQuery = {
      topic,
      language,
      page:  page  ? parseInt(page, 10)  : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sort,
    };
    return this.exploreService.getExploreData(req.user.id, query);
  }

  @Get('topics')
  getTopics(@Request() req: { user: { id: string } }) {
    return this.exploreService.getTopics(req.user.id);
  }
}

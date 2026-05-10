import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SavedService } from './saved.service';
import type {
  CreateCollectionDto,
  MoveToCollectionDto,
  SaveRepoDto,
  UpdateRepoStatusDto,
} from './saved.interfaces';

@Controller('saved')
@UseGuards(AuthGuard)
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Get('collections')
  getCollections(@Request() req: { user: { id: string } }) {
    return this.savedService.getCollections(req.user.id);
  }

  @Get('check/:repoId')
  isRepoSaved(
    @Request() req: { user: { id: string } },
    @Param('repoId', ParseIntPipe) repoId: number,
  ) {
    return this.savedService.isRepoSaved(req.user.id, repoId);
  }

  @Get()
  getSavedRepos(
    @Request() req: { user: { id: string } },
    @Query('collection') collection?: string,
    @Query('page') page?: string,
  ) {
    return this.savedService.getSavedRepos(
      req.user.id,
      collection,
      page ? parseInt(page, 10) : 1,
    );
  }

  @Post('collections')
  createCollection(
    @Request() req: { user: { id: string } },
    @Body() body: CreateCollectionDto,
  ) {
    return this.savedService.createCollection(req.user.id, body);
  }

  @Post()
  saveRepo(
    @Request() req: { user: { id: string } },
    @Body() body: SaveRepoDto,
  ) {
    return this.savedService.saveRepo(req.user.id, body);
  }

  @Patch(':repoId/status')
  updateStatus(
    @Request() req: { user: { id: string } },
    @Param('repoId', ParseIntPipe) repoId: number,
    @Body() body: UpdateRepoStatusDto,
  ) {
    return this.savedService.updateStatus(req.user.id, repoId, body);
  }

  @Patch(':repoId/collection')
  moveToCollection(
    @Request() req: { user: { id: string } },
    @Param('repoId', ParseIntPipe) repoId: number,
    @Body() body: MoveToCollectionDto,
  ) {
    return this.savedService.moveToCollection(req.user.id, repoId, body);
  }

  @Delete('collections/:id')
  deleteCollection(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.savedService.deleteCollection(req.user.id, id);
  }

  @Delete(':repoId')
  removeRepo(
    @Request() req: { user: { id: string } },
    @Param('repoId', ParseIntPipe) repoId: number,
  ) {
    return this.savedService.removeRepo(req.user.id, repoId);
  }
}

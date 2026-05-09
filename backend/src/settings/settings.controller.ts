import { Body, Controller, Delete, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SettingsService } from './settings.service';
import type { UpdatePasswordDto, UpdateProfileDto } from './types/settings.interfaces';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('profile')
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.settingsService.getProfile(req.user.id);
  }

  @Get('profile/full')
  async getFullProfile(@Request() req: { user: { id: string } }) {
    return this.settingsService.getFullProfile(req.user.id);
  }

  @Get('activity')
  async getActivity(@Request() req: { user: { id: string } }) {
    return this.settingsService.getActivity(req.user.id);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() body: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(req.user.id, body);
  }

  @Patch('password')
  async updatePassword(
    @Request() req: { user: { id: string } },
    @Body() body: UpdatePasswordDto,
  ) {
    return this.settingsService.updatePassword(req.user.id, body);
  }

  @Delete('account')
  async deleteAccount(@Request() req: { user: { id: string } }) {
    return this.settingsService.deleteAccount(req.user.id);
  }
}

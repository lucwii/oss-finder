import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import type { OnboardingData } from './types/onboarding.interfaces';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
@UseGuards(AuthGuard)
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    @Post('save')
    async saveOnboarding(
        @Request() req: { user: { id: string } },
        @Body() data: OnboardingData
    ) {
        const userId = req.user.id;
        return this.onboardingService.saveOnboarding(userId, data);
    }

    @Get('profile')
    async getProfile(@Request() req: { user: { id: string } }) {
        const userId = req.user.id;
        return this.onboardingService.getProfile(userId);
    }
}

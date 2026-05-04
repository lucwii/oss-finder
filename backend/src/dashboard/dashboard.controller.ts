import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    async getDashboard(@Request() req) {
        return this.dashboardService.getDashboardData(req.user.id);
    }

    @Post('track/repo')
    async trackRepo(@Request() req, @Body() body: { repoData: any }) {
        await this.dashboardService.trackRepoView(req.user.id, body.repoData);
        return { success: true };
    }

    @Post('track/issue')
    async trackIssue(@Request() req) {
        await this.dashboardService.trackIssueClick(req.user.id);
        return { success: true };
    }
}

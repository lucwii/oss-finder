import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { GithubModule } from 'src/github/github.module';
import { OnboardingModule } from 'src/onboarding/onboarding.module';

@Module({
  imports: [
    GithubModule,
    OnboardingModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

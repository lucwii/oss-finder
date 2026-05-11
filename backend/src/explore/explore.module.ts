import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExploreService } from './explore.service';
import { ExploreController } from './explore.controller';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, OnboardingModule, AuthModule],
  providers: [ExploreService],
  controllers: [ExploreController],
})
export class ExploreModule {}

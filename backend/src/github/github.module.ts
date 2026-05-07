import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { AuthModule } from '../auth/auth.module';
import { OnboardingModule } from '../onboarding/onboarding.module';

@Module({
  imports: [HttpModule, AuthModule, OnboardingModule],
  providers: [GithubService],
  controllers: [GithubController],
  exports: [GithubService],
})
export class GithubModule {}

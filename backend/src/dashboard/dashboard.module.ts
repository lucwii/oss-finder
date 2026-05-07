import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { GithubModule } from 'src/github/github.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    GithubModule,
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

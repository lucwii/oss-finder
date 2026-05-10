import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';

@Module({
  imports: [AuthModule],
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule {}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException();

    const {
      data: { user },
      error,
    } = await this.supabase.db.auth.getUser(token);

    if (error || !user) throw new UnauthorizedException();

    request.user = user;
    return true;
  }

  private extractToken(request: any): string | null {
    const auth: string = request.headers?.authorization ?? '';
    if (!auth.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}

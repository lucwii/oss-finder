import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdatePasswordDto, UpdateProfileDto } from './types/settings.interfaces';

@Injectable()
export class SettingsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getProfile(userId: string) {
    const supabase = this.supabaseService.getdb();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new BadRequestException('Failed to fetch profile');
    }

    const { data: { user } } = await supabase.auth.admin.getUserById(userId);

    return {
      ...profile,
      email: user?.email ?? null,
    };
  }

  async getFullProfile(userId: string) {
    const profile = await this.getProfile(userId);
    const supabase = this.supabaseService.getdb();

    const { data: stats } = await supabase
      .from('user_stats')
      .select('repos_viewed, issues_clicked, days_streak, max_streak, languages_explored, last_active_date')
      .eq('user_id', userId)
      .single();

    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    return {
      ...profile,
      stats: {
        repos_viewed: stats?.repos_viewed ?? 0,
        issues_clicked: stats?.issues_clicked ?? 0,
        days_streak: stats?.days_streak ?? 0,
        max_streak: stats?.max_streak ?? 0,
        languages_explored: stats?.languages_explored ?? [],
        achievements: achievements?.map((a: { achievement_id: string }) => a.achievement_id) ?? [],
        last_active_date: stats?.last_active_date ?? null,
      },
    };
  }

  async getActivity(userId: string) {
    const supabase = this.supabaseService.getdb();

    const { data, error } = await supabase
      .rpc('get_user_activity', { p_user_id: userId });

    if (error) throw new BadRequestException(error.message);

    return data ?? [];
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    if (data.languages !== undefined && data.languages.length === 0) {
      throw new BadRequestException('At least one language must be selected');
    }

    if (data.interests !== undefined && data.interests.length === 0) {
      throw new BadRequestException('At least one interest must be selected');
    }

    const supabase = this.supabaseService.getdb();

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.languages !== undefined) updatePayload.languages = data.languages;
    if (data.experience_years !== undefined) updatePayload.experience_years = data.experience_years;
    if (data.open_source_experience !== undefined) updatePayload.open_source_experience = data.open_source_experience;
    if (data.interests !== undefined) updatePayload.interests = data.interests;
    if (data.goal !== undefined) updatePayload.goal = data.goal;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException('Failed to update profile');
    }

    return updated;
  }

  async updatePassword(userId: string, data: UpdatePasswordDto) {
    if (data.new_password !== data.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    if (data.new_password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const supabase = this.supabaseService.getdb();

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: data.new_password,
    });

    if (error) {
      throw new BadRequestException('Failed to update password');
    }

    return { success: true, message: 'Password updated successfully' };
  }

  async deleteAccount(userId: string) {
    const supabase = this.supabaseService.getdb();

    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw new BadRequestException('Failed to delete account data');
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new BadRequestException('Failed to delete account');
    }

    return { success: true };
  }
}

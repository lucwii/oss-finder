// backend/src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GithubService } from '../github/github.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import {
  DailyRecommendation,
  UserStats,
  Achievement,
  DashboardData,
} from './types/dashboard.interfaces';

@Injectable()
export class DashboardService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly githubService: GithubService,
    private readonly onboardingService: OnboardingService,
  ) {}

  // ============================================
  // GLAVNI METOD — sve u jednom pozivu
  // ============================================
  async getDashboardData(userId: string): Promise<DashboardData> {
    // Sve fetchujemo paralelno da bude brže
    const [recommendations, trending, stats, recentlyViewed] =
      await Promise.all([
        this.getDailyRecommendations(userId),
        this.getTrending(),
        this.getOrCreateStats(userId),
        this.getRecentlyViewed(userId),
      ]);

    // Achievements računamo na osnovu stats
    const achievements = this.calculateAchievements(stats);

    // Ažuriraj streak
    await this.updateStreak(userId, stats);

    return {
      recommendations,
      trending,
      stats,
      achievements,
      recently_viewed: recentlyViewed,
    };
  }

  // ============================================
  // DAILY RECOMMENDATIONS SA KEŠIRANJEM
  // ============================================
  async getDailyRecommendations(userId: string): Promise<DailyRecommendation[]> {
    const supabase = this.supabaseService.getdb();
    const today = new Date().toISOString().split('T')[0]; // "2024-01-15"

    // Proveri da li već postoje preporuke za danas
    const { data: cached } = await supabase
      .from('daily_recommendations')
      .select('repos')
      .eq('user_id', userId)
      .eq('generated_date', today)
      .single();

    // Ako postoje — vrati ih odmah (ne udari GitHub API)
    if (cached) {
      return cached.repos as DailyRecommendation[];
    }

    // Ako ne postoje — fetchuj nove
    const profile = await this.onboardingService.getProfile(userId);
    const recommendations = await this.githubService
      .getPersonalizedRecommendations(userId);

    // Dodaj match_percentage na svaki repo
    const withPercentage = recommendations.map((rec) => ({
      ...rec,
      match_percentage: this.calculateMatchPercentage(rec.score),
    }));

    // Sačuvaj u Supabase za danas
    await supabase
      .from('daily_recommendations')
      .upsert({
        user_id: userId,
        repos: withPercentage,
        generated_date: today,
      });

    return withPercentage;
  }

  // ============================================
  // TRENDING — isti za sve korisnike
  // ============================================
  async getTrending(): Promise<DailyRecommendation[]> {
    const supabase = this.supabaseService.getdb();
    const today = new Date().toISOString().split('T')[0];

    // Trending keširamo globalno (ne per user)
    const { data: cached } = await supabase
      .from('daily_recommendations')
      .select('repos')
      .eq('user_id', '00000000-0000-0000-0000-000000000000') // fake global user
      .eq('generated_date', today)
      .single();

    if (cached) return cached.repos as DailyRecommendation[];

    // Fetchuj trending — popularni JavaScript repoi kao default
    const trending = await this.githubService
      .getRecommendations('javascript', 'intermediate');

    const withPercentage = trending.slice(0, 5).map((rec) => ({
      ...rec,
      match_percentage: this.calculateMatchPercentage(rec.score),
    }));

    // Sačuvaj globalni keš
    await supabase
      .from('daily_recommendations')
      .upsert({
        user_id: '00000000-0000-0000-0000-000000000000',
        repos: withPercentage,
        generated_date: today,
      });

    return withPercentage;
  }

  // ============================================
  // STATISTIKE
  // ============================================
  async getOrCreateStats(userId: string): Promise<UserStats> {
    const supabase = this.supabaseService.getdb();

    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Ako ne postoje stats, napravi ih
    if (!stats) {
      const { data: newStats } = await supabase
        .from('user_stats')
        .insert({ user_id: userId })
        .select()
        .single();

      return newStats as UserStats;
    }

    return stats as UserStats;
  }

  async trackRepoView(userId: string, repoData: any): Promise<void> {
    const supabase = this.supabaseService.getdb();

    // Dodaj u recently viewed
    await supabase
      .from('recently_viewed')
      .upsert({
        user_id: userId,
        repo_id: repoData.id,
        repo_data: repoData,
        viewed_at: new Date().toISOString(),
      });

    // Inkrementiraj repos_viewed
    await supabase.rpc('increment_repos_viewed', { p_user_id: userId });
  }

  async trackIssueClick(userId: string): Promise<void> {
    const supabase = this.supabaseService.getdb();
    await supabase.rpc('increment_issues_clicked', { p_user_id: userId });
  }

  // ============================================
  // RECENTLY VIEWED
  // ============================================
  async getRecentlyViewed(userId: string): Promise<any[]> {
    const supabase = this.supabaseService.getdb();

    const { data } = await supabase
      .from('recently_viewed')
      .select('repo_data')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(5);

    return data?.map((item) => item.repo_data) ?? [];
  }

  // ============================================
  // ACHIEVEMENTS
  // ============================================
  private calculateAchievements(stats: UserStats): Achievement[] {
    const allAchievements = [
      {
        id: 'first_look',
        name: 'First Look',
        description: 'Viewed your first repository',
        icon: '🌱',
        unlocked: stats.repos_viewed >= 1,
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Viewed 10 repositories',
        icon: '🔍',
        unlocked: stats.repos_viewed >= 10,
      },
      {
        id: 'committed',
        name: 'Committed',
        description: '7 day streak',
        icon: '⭐',
        unlocked: stats.days_streak >= 7,
      },
      {
        id: 'issue_hunter',
        name: 'Issue Hunter',
        description: 'Clicked on 5 issues',
        icon: '🎯',
        unlocked: stats.issues_clicked >= 5,
      },
      {
        id: 'contributor',
        name: 'Contributor',
        description: 'Clicked on 20 issues',
        icon: '🚀',
        unlocked: stats.issues_clicked >= 20,
      },
    ];

    return allAchievements;
  }

  // ============================================
  // STREAK LOGIKA
  // ============================================
  private async updateStreak(userId: string, stats: UserStats): Promise<void> {
    const supabase = this.supabaseService.getdb();
    const today = new Date().toISOString().split('T')[0];
    const lastActive = stats.last_active_date;

    // Ako je korisnik već bio aktivan danas — ne menjaj streak
    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Ako je bio aktivan juče — nastavi streak
    // Ako nije — resetuj na 1
    const newStreak = lastActive === yesterdayStr
      ? stats.days_streak + 1
      : 1;

    await supabase
      .from('user_stats')
      .update({
        days_streak: newStreak,
        last_active_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  }

  // ============================================
  // HELPER
  // ============================================
  private calculateMatchPercentage(score: number): number {
    // Score ide od 0 do ~100, mapiramo na 70-99%
    // Da ne prikazujemo nikad ispod 70% (loše za UX)
    const percentage = Math.min(99, Math.max(70, Math.round(score * 0.9 + 20)));
    return percentage;
  }
}
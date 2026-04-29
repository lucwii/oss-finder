import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { OnboardingData, UserProfile } from './types/onboarding.interfaces';

@Injectable()
export class OnboardingService {
    constructor(private readonly supabaseService: SupabaseService) {}

    async saveOnboarding(userId: string, data: OnboardingData): Promise<UserProfile> {
        if(!data.languages || data.languages.length === 0) {
            throw new BadRequestException('At least one programming language must be selected');
        }

        if(!data.experience_years)  {
            throw new BadRequestException('Experience years must be provided');
        }

        if(!data.interests || data.interests.length === 0) {
            throw new BadRequestException('At least one interest must be selected');
        }

        if(!data.goal) {
            throw new BadRequestException('Goal must be provided');
        }

        const supabase = this.supabaseService.getdb();

        const {data: profile, error} = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                languages: data.languages,
                experience_years: data.experience_years,
                open_source_experience: data.open_source_experience,
                interests: data.interests,
                goal: data.goal,
                onboarding_completed: true,
                updated_at: new Date().toISOString(),
            })
            .select('*')
            .single();
            
        if(error) {
            throw new BadRequestException('Failed to save onboarding data');
        }

        return profile;
    }

    async getProfile(userId: string): Promise<UserProfile> {
        const supabase = this.supabaseService.getdb();

        const {data: profile, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if(error) {
            throw new BadRequestException('Failed to fetch user profile');
        }

        return profile;
    }
}

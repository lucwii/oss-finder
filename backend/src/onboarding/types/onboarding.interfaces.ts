export interface OnboardingData {
  languages: string[];
  experience_years: string;
  open_source_experience: string;
  interests: string[];
  goal: string;
}

export interface UserProfile extends OnboardingData {
  id: string;
  onboarding_completed: boolean;
  created_at: string;
}
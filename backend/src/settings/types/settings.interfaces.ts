export interface UpdateProfileDto {
  languages?: string[];
  experience_years?: string;
  open_source_experience?: string;
  interests?: string[];
  goal?: string;
}

export interface UpdatePasswordDto {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

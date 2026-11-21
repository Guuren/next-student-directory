export interface Student {
  id: number;
  student_id: string;
  student_name: string;
  section: string;
  email: string;
  mobile_number?: string | null;
  social_media_link?: string | null;
  profile_picture_url?: string | null;
  created_at?: string;
}

export interface AuthStudent {
  id: number;
  student_id: string;
  student_name: string;
  email: string;
  section: string;
  mobile_number?: string | null;
  social_media_link?: string | null;
  profile_picture_url?: string | null;
}

export interface LoginResponse {
  message: string;
  token?: string;
  student?: AuthStudent;
}

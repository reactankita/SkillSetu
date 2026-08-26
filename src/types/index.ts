export type UserRole = 'student' | 'client' | 'admin';

export type DeliveryMode = 'online' | 'on_campus' | 'both';

export type PricingUnit = 'per_hour' | 'per_project' | 'per_session' | 'per_item';

export type ServiceStatus = 'published' | 'draft' | 'paused';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED_BY_STUDENT'
  | 'CONFIRMED_BY_CLIENT'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'RESOLVED';

export type PaymentStatus = 'PENDING' | 'PROTECTED' | 'RELEASED' | 'REFUNDED';

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'needs_review';

export type DisputeStatus = 'reported' | 'under_review' | 'resolved' | 'refunded' | 'released';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface StudentProfile extends Profile {
  skillsetu_id: string; // e.g. "SK-ST-104827"
  college: string;
  course: string;
  year: string;
  location: string;
  about: string;
  skills: string[];
  experience: string;
  education: string;
  availability_days: string[];
  rating: number;
  review_count: number;
  completed_bookings_count: number;
  hourly_rate_base: number;
  team_mode_available: boolean;
  badges: string[];
  verification_status: VerificationStatus;
}

export type ClientType = 'individual' | 'company' | 'organization' | 'student_client';

export interface ClientProfile extends Profile {
  skillsetu_id: string; // e.g. "SK-CL-204891"
  client_type: ClientType;
  organization_name?: string;
  organization_type?: string;
  website?: string;
  industry?: string;
  representative_role?: string;
  hiring_purpose?: string[];
  college?: string;
  course?: string;
  year?: string;
  location: string;
  about: string;
  total_spent: number;
  hired_count: number;
  rating_given_avg: number;
  verification_status: VerificationStatus;
}

export interface Service {
  id: string;
  student_id: string;
  student_name: string;
  student_avatar: string;
  student_college: string;
  student_rating: number;
  student_review_count: number;
  student_skillsetu_id: string;
  student_badges: string[];
  title: string;
  slug: string;
  category: string;
  description: string;
  location: string;
  delivery_mode: DeliveryMode;
  price: number;
  pricing_unit: PricingUnit;
  availability_days: string[];
  team_service: boolean;
  portfolio_urls: string[];
  skills: string[];
  status: ServiceStatus;
  views_count: number;
  bookings_count: number;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_code: string; // e.g. "RAS-48210"
  service_id: string;
  service_title: string;
  service_category: string;
  student_id: string;
  student_name: string;
  student_avatar: string;
  student_college: string;
  client_id: string;
  client_name: string;
  client_org?: string;
  booking_date: string;
  time_slot: string;
  duration_hours: number;
  message?: string;
  service_price: number;
  platform_fee: number;
  total_amount: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  service_id: string;
  student_id: string;
  client_id: string;
  client_name: string;
  client_org?: string;
  client_avatar?: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  client_id: string;
  client_name: string;
  client_org?: string;
  client_verified: boolean;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: string;
  delivery_mode: DeliveryMode;
  status: 'open' | 'in_progress' | 'closed';
  responses_count: number;
  created_at: string;
}

export interface CommunityResponse {
  id: string;
  post_id: string;
  student_id: string;
  student_name: string;
  student_avatar: string;
  student_college: string;
  proposal_text: string;
  proposed_rate: number;
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'booking' | 'payment' | 'review' | 'verification' | 'community' | 'subscription' | 'dispute';
  title: string;
  message: string;
  link_url: string;
  is_read: boolean;
  created_at: string;
}

export interface Dispute {
  id: string;
  booking_id: string;
  booking_code: string;
  raised_by_id: string;
  raised_by_name: string;
  raised_by_role: UserRole;
  issue_type: string;
  description: string;
  status: DisputeStatus;
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface StudentVerification {
  id: string;
  student_id: string;
  student_name: string;
  college: string;
  course: string;
  year: string;
  college_id_number: string;
  college_email: string;
  id_card_doc_url?: string;
  status: VerificationStatus;
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export type PortfolioTheme = 'professional' | 'creative' | 'minimal';
export type PortfolioStatus = 'draft' | 'published' | 'unpublished';

export interface PortfolioMedia {
  id: string;
  type: 'image' | 'document' | 'pdf';
  url: string;
  title?: string;
  is_cover: boolean;
}

export interface PortfolioProject {
  id: string;
  portfolio_id: string;
  title: string;
  category: string;
  short_description: string;
  detailed_description: string;
  role: string;
  tools_used: string[];
  duration: string;
  completion_date: string;
  client_or_organization?: string;
  project_outcome: string;
  cover_image_url: string;
  media: PortfolioMedia[];
  live_url?: string;
  github_url?: string;
  connected_service_id?: string;
  is_featured: boolean;
  created_at: string;
}

export interface PortfolioExperience {
  id: string;
  portfolio_id: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
  is_current: boolean;
}

export interface PortfolioEducation {
  id: string;
  portfolio_id: string;
  degree_or_course: string;
  institution: string;
  year: string;
  grade_or_score?: string;
  highlights?: string;
}

export interface PortfolioCertification {
  id: string;
  portfolio_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
}

export interface PortfolioAchievement {
  id: string;
  portfolio_id: string;
  title: string;
  year: string;
  description: string;
}

export interface PortfolioSectionConfig {
  id: string;
  name: string;
  visible: boolean;
}

export interface Portfolio {
  id: string;
  student_id: string;
  username: string; // e.g. "sarah-chen"
  headline: string;
  about_bio: string;
  theme: PortfolioTheme;
  status: PortfolioStatus;
  skills: string[];
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  certifications: PortfolioCertification[];
  achievements: PortfolioAchievement[];
  custom_sections?: PortfolioSectionConfig[];
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
    website?: string;
  };
  views_count: number;
  published_at?: string;
  updated_at: string;
  created_at: string;
}


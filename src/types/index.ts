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

export interface ClientProfile extends Profile {
  skillsetu_id: string; // e.g. "SK-CL-104827"
  organization_name?: string;
  organization_type?: string;
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

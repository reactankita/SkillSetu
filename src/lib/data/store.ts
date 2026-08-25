'use client';

import { useState, useEffect } from 'react';
import {
  StudentProfile,
  ClientProfile,
  Service,
  Booking,
  Review,
  CommunityPost,
  CommunityResponse,
  NotificationItem,
  Dispute,
  StudentVerification,
  UserRole,
  BookingStatus,
  PaymentStatus,
  VerificationStatus,
} from '@/types';
import {
  SEED_STUDENTS,
  SEED_CLIENTS,
  SEED_SERVICES,
  SEED_BOOKINGS,
  SEED_REVIEWS,
  SEED_COMMUNITY_POSTS,
  SEED_COMMUNITY_RESPONSES,
  SEED_NOTIFICATIONS,
  SEED_DISPUTES,
  SEED_VERIFICATIONS,
} from './seedData';
import { SITE_CONFIG } from '@/config/site';

const STORAGE_KEYS = {
  CURRENT_USER_ROLE: 'skillsetu_user_role',
  CURRENT_STUDENT_ID: 'skillsetu_current_student_id',
  CURRENT_CLIENT_ID: 'skillsetu_current_client_id',
  SERVICES: 'skillsetu_services',
  STUDENTS: 'skillsetu_students',
  CLIENTS: 'skillsetu_clients',
  BOOKINGS: 'skillsetu_bookings',
  REVIEWS: 'skillsetu_reviews',
  COMMUNITY_POSTS: 'skillsetu_community_posts',
  COMMUNITY_RESPONSES: 'skillsetu_community_responses',
  NOTIFICATIONS: 'skillsetu_notifications',
  DISPUTES: 'skillsetu_disputes',
  VERIFICATIONS: 'skillsetu_verifications',
};

// In-memory fallback
let memoryState = {
  userRole: 'student' as UserRole,
  currentStudentId: 'student-1',
  currentClientId: 'client-1',
  services: [...SEED_SERVICES],
  students: [...SEED_STUDENTS],
  clients: [...SEED_CLIENTS],
  bookings: [...SEED_BOOKINGS],
  reviews: [...SEED_REVIEWS],
  communityPosts: [...SEED_COMMUNITY_POSTS],
  communityResponses: [...SEED_COMMUNITY_RESPONSES],
  notifications: [...SEED_NOTIFICATIONS],
  disputes: [...SEED_DISPUTES],
  verifications: [...SEED_VERIFICATIONS],
};

// Event emitter for reactive updates across components
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function loadItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveItem<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Data Store API
export const SkillSetuStore = {
  getUserRole(): UserRole {
    return loadItem<UserRole>(STORAGE_KEYS.CURRENT_USER_ROLE, memoryState.userRole);
  },

  setUserRole(role: UserRole) {
    memoryState.userRole = role;
    saveItem(STORAGE_KEYS.CURRENT_USER_ROLE, role);
    notifyListeners();
  },

  getCurrentStudent(): StudentProfile {
    const students = this.getStudents();
    const currentId = loadItem<string>(STORAGE_KEYS.CURRENT_STUDENT_ID, memoryState.currentStudentId);
    return students.find((s) => s.id === currentId) || students[0];
  },

  getCurrentClient(): ClientProfile {
    const clients = this.getClients();
    const currentId = loadItem<string>(STORAGE_KEYS.CURRENT_CLIENT_ID, memoryState.currentClientId);
    return clients.find((c) => c.id === currentId) || clients[0];
  },

  getStudents(): StudentProfile[] {
    return loadItem<StudentProfile[]>(STORAGE_KEYS.STUDENTS, memoryState.students);
  },

  getClients(): ClientProfile[] {
    return loadItem<ClientProfile[]>(STORAGE_KEYS.CLIENTS, memoryState.clients);
  },

  getStudentById(id: string): StudentProfile | undefined {
    return this.getStudents().find((s) => s.id === id);
  },

  getServices(): Service[] {
    return loadItem<Service[]>(STORAGE_KEYS.SERVICES, memoryState.services);
  },

  getServiceById(id: string): Service | undefined {
    return this.getServices().find((s) => s.id === id);
  },

  addService(newService: Omit<Service, 'id' | 'created_at' | 'views_count' | 'bookings_count'>): Service {
    const services = this.getServices();
    const created: Service = {
      ...newService,
      id: `service-${Date.now()}`,
      views_count: 0,
      bookings_count: 0,
      created_at: new Date().toISOString(),
    };
    const updated = [created, ...services];
    memoryState.services = updated;
    saveItem(STORAGE_KEYS.SERVICES, updated);
    notifyListeners();
    return created;
  },

  updateService(id: string, patch: Partial<Service>) {
    const services = this.getServices();
    const updated = services.map((s) => (s.id === id ? { ...s, ...patch } : s));
    memoryState.services = updated;
    saveItem(STORAGE_KEYS.SERVICES, updated);
    notifyListeners();
  },

  deleteService(id: string) {
    const services = this.getServices();
    const updated = services.filter((s) => s.id !== id);
    memoryState.services = updated;
    saveItem(STORAGE_KEYS.SERVICES, updated);
    notifyListeners();
  },

  getBookings(): Booking[] {
    return loadItem<Booking[]>(STORAGE_KEYS.BOOKINGS, memoryState.bookings);
  },

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  createBooking(data: {
    serviceId: string;
    bookingDate: string;
    timeSlot: string;
    durationHours: number;
    message?: string;
  }): Booking {
    const service = this.getServiceById(data.serviceId);
    if (!service) throw new Error("Service not found");

    const client = this.getCurrentClient();
    const servicePrice = service.price * data.durationHours;
    const platformFee = Math.round(servicePrice * SITE_CONFIG.platformFeeRate);
    const totalAmount = servicePrice + platformFee;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      booking_code: `RAS-${Math.floor(10000 + Math.random() * 90000)}`,
      service_id: service.id,
      service_title: service.title,
      service_category: service.category,
      student_id: service.student_id,
      student_name: service.student_name,
      student_avatar: service.student_avatar,
      student_college: service.student_college,
      client_id: client.id,
      client_name: client.full_name,
      client_org: client.organization_name,
      booking_date: data.bookingDate,
      time_slot: data.timeSlot,
      duration_hours: data.durationHours,
      message: data.message,
      service_price: servicePrice,
      platform_fee: platformFee,
      total_amount: totalAmount,
      status: 'CONFIRMED',
      payment_status: 'PROTECTED',
      created_at: new Date().toISOString(),
    };

    const bookings = this.getBookings();
    const updated = [newBooking, ...bookings];
    memoryState.bookings = updated;
    saveItem(STORAGE_KEYS.BOOKINGS, updated);

    // Notify student
    this.addNotification({
      user_id: service.student_id,
      type: 'booking',
      title: 'New Booking Confirmed (Payment Protected)',
      message: `${client.full_name} booked ${service.title} for ${data.bookingDate}. Payment of ₹${totalAmount} is secured.`,
      link_url: '/bookings',
    });

    notifyListeners();
    return newBooking;
  },

  updateBookingStatus(id: string, status: BookingStatus, paymentStatus?: PaymentStatus) {
    const bookings = this.getBookings();
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          status,
          ...(paymentStatus ? { payment_status: paymentStatus } : {}),
          updated_at: new Date().toISOString(),
        };
      }
      return b;
    });

    memoryState.bookings = updated;
    saveItem(STORAGE_KEYS.BOOKINGS, updated);
    notifyListeners();
  },

  getReviews(): Review[] {
    return loadItem<Review[]>(STORAGE_KEYS.REVIEWS, memoryState.reviews);
  },

  addReview(reviewData: {
    bookingId: string;
    rating: number;
    reviewText: string;
  }): Review {
    const booking = this.getBookingById(reviewData.bookingId);
    if (!booking) throw new Error("Booking not found");

    const newReview: Review = {
      id: `review-${Date.now()}`,
      booking_id: booking.id,
      service_id: booking.service_id,
      student_id: booking.student_id,
      client_id: booking.client_id,
      client_name: booking.client_name,
      client_org: booking.client_org,
      rating: reviewData.rating,
      review_text: reviewData.reviewText,
      created_at: new Date().toISOString(),
    };

    const reviews = this.getReviews();
    const updated = [newReview, ...reviews];
    memoryState.reviews = updated;
    saveItem(STORAGE_KEYS.REVIEWS, updated);

    // Notify student
    this.addNotification({
      user_id: booking.student_id,
      type: 'review',
      title: `${reviewData.rating}-Star Review Received!`,
      message: `${booking.client_name} left a review for ${booking.service_title}.`,
      link_url: '/reviews',
    });

    notifyListeners();
    return newReview;
  },

  getCommunityPosts(): CommunityPost[] {
    return loadItem<CommunityPost[]>(STORAGE_KEYS.COMMUNITY_POSTS, memoryState.communityPosts);
  },

  addCommunityPost(post: Omit<CommunityPost, 'id' | 'created_at' | 'responses_count' | 'client_id' | 'client_name' | 'client_org' | 'client_verified'>): CommunityPost {
    const client = this.getCurrentClient();
    const created: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      client_id: client.id,
      client_name: client.full_name,
      client_org: client.organization_name,
      client_verified: client.verification_status === 'verified',
      responses_count: 0,
      created_at: new Date().toISOString(),
    };

    const posts = this.getCommunityPosts();
    const updated = [created, ...posts];
    memoryState.communityPosts = updated;
    saveItem(STORAGE_KEYS.COMMUNITY_POSTS, updated);
    notifyListeners();
    return created;
  },

  getCommunityResponses(postId?: string): CommunityResponse[] {
    const all = loadItem<CommunityResponse[]>(STORAGE_KEYS.COMMUNITY_RESPONSES, memoryState.communityResponses);
    return postId ? all.filter((r) => r.post_id === postId) : all;
  },

  addCommunityResponse(postId: string, proposalText: string, proposedRate: number): CommunityResponse {
    const student = this.getCurrentStudent();
    const created: CommunityResponse = {
      id: `response-${Date.now()}`,
      post_id: postId,
      student_id: student.id,
      student_name: student.full_name,
      student_avatar: student.avatar_url,
      student_college: student.college,
      proposal_text: proposalText,
      proposed_rate: proposedRate,
      status: 'applied',
      created_at: new Date().toISOString(),
    };

    const all = this.getCommunityResponses();
    const updated = [created, ...all];
    memoryState.communityResponses = updated;
    saveItem(STORAGE_KEYS.COMMUNITY_RESPONSES, updated);

    // Increment post responses count
    const posts = this.getCommunityPosts();
    const updatedPosts = posts.map((p) => (p.id === postId ? { ...p, responses_count: p.responses_count + 1 } : p));
    memoryState.communityPosts = updatedPosts;
    saveItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);

    notifyListeners();
    return created;
  },

  getNotifications(): NotificationItem[] {
    return loadItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, memoryState.notifications);
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) {
    const all = this.getNotifications();
    const created: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    const updated = [created, ...all];
    memoryState.notifications = updated;
    saveItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyListeners();
  },

  markNotificationAsRead(id: string) {
    const all = this.getNotifications();
    const updated = all.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    memoryState.notifications = updated;
    saveItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyListeners();
  },

  markAllNotificationsAsRead() {
    const all = this.getNotifications();
    const updated = all.map((n) => ({ ...n, is_read: true }));
    memoryState.notifications = updated;
    saveItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyListeners();
  },

  getDisputes(): Dispute[] {
    return loadItem<Dispute[]>(STORAGE_KEYS.DISPUTES, memoryState.disputes);
  },

  raiseDispute(bookingId: string, issueType: string, description: string): Dispute {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");

    const role = this.getUserRole();
    const name = role === 'student' ? booking.student_name : booking.client_name;
    const userId = role === 'student' ? booking.student_id : booking.client_id;

    const newDispute: Dispute = {
      id: `dispute-${Date.now()}`,
      booking_id: booking.id,
      booking_code: booking.booking_code,
      raised_by_id: userId,
      raised_by_name: name,
      raised_by_role: role,
      issue_type: issueType,
      description,
      status: 'reported',
      created_at: new Date().toISOString(),
    };

    const disputes = this.getDisputes();
    const updated = [newDispute, ...disputes];
    memoryState.disputes = updated;
    saveItem(STORAGE_KEYS.DISPUTES, updated);

    // Update booking status
    this.updateBookingStatus(bookingId, 'DISPUTED', 'PROTECTED');

    notifyListeners();
    return newDispute;
  },

  resolveDispute(disputeId: string, action: 'release' | 'refund', notes?: string) {
    const disputes = this.getDisputes();
    const dispute = disputes.find((d) => d.id === disputeId);
    if (!dispute) return;

    const updated = disputes.map((d) =>
      d.id === disputeId
        ? {
            ...d,
            status: action === 'release' ? ('released' as const) : ('refunded' as const),
            resolved_at: new Date().toISOString(),
            resolution_notes: notes || `Resolved by admin: funds ${action}d.`,
          }
        : d
    );

    memoryState.disputes = updated;
    saveItem(STORAGE_KEYS.DISPUTES, updated);

    // Update booking
    this.updateBookingStatus(
      dispute.booking_id,
      'RESOLVED',
      action === 'release' ? 'RELEASED' : 'REFUNDED'
    );

    notifyListeners();
  },

  getVerifications(): StudentVerification[] {
    return loadItem<StudentVerification[]>(STORAGE_KEYS.VERIFICATIONS, memoryState.verifications);
  },

  submitStudentVerification(data: {
    college: string;
    course: string;
    year: string;
    collegeIdNumber: string;
    collegeEmail: string;
  }) {
    const student = this.getCurrentStudent();
    const newVerif: StudentVerification = {
      id: `verif-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      college: data.college,
      course: data.course,
      year: data.year,
      college_id_number: data.collegeIdNumber,
      college_email: data.collegeEmail,
      status: 'verified', // Instant simulation for demo/prototype
      submitted_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString(),
    };

    const all = this.getVerifications();
    const updated = [newVerif, ...all.filter((v) => v.student_id !== student.id)];
    memoryState.verifications = updated;
    saveItem(STORAGE_KEYS.VERIFICATIONS, updated);

    // Update student profile status
    const students = this.getStudents();
    const updatedStudents = students.map((s) =>
      s.id === student.id
        ? {
            ...s,
            college: data.college,
            course: data.course,
            year: data.year,
            verification_status: 'verified' as VerificationStatus,
            badges: s.badges.includes('Verified Student') ? s.badges : ['Verified Student', ...s.badges],
          }
        : s
    );
    memoryState.students = updatedStudents;
    saveItem(STORAGE_KEYS.STUDENTS, updatedStudents);

    notifyListeners();
  },

  updateVerificationStatus(verifId: string, status: VerificationStatus) {
    const all = this.getVerifications();
    const updated = all.map((v) => (v.id === verifId ? { ...v, status, reviewed_at: new Date().toISOString() } : v));
    memoryState.verifications = updated;
    saveItem(STORAGE_KEYS.VERIFICATIONS, updated);

    const verif = all.find((v) => v.id === verifId);
    if (verif) {
      const students = this.getStudents();
      const updatedStudents = students.map((s) =>
        s.id === verif.student_id ? { ...s, verification_status: status } : s
      );
      memoryState.students = updatedStudents;
      saveItem(STORAGE_KEYS.STUDENTS, updatedStudents);
    }

    notifyListeners();
  },
};

// React hook for consuming state reactively in client components
export function useSkillSetuStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeStore(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return SkillSetuStore;
}

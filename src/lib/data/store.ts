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
  ClientVerification,
  Portfolio,
  PortfolioProject,
  UserRole,
  BookingStatus,
  PaymentStatus,
  VerificationStatus,
  ClientType,
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
  SEED_PORTFOLIOS,
} from './seedData';
import { SITE_CONFIG } from '@/config/site';

const STORAGE_KEYS = {
  CURRENT_USER_ROLE: 'skillsetu_user_role',
  CURRENT_STUDENT_ID: 'skillsetu_current_student_id',
  CURRENT_CLIENT_ID: 'skillsetu_current_client_id',
  SERVICES: 'skillsetu_services',
  STUDENTS: 'skillsetu_students',
  CLIENTS: 'skillsetu_clients',
  PORTFOLIOS: 'skillsetu_portfolios',
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
  portfolios: [...SEED_PORTFOLIOS],
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

  getClientById(id: string): ClientProfile | undefined {
    return this.getClients().find((c) => c.id === id);
  },

  // ----------------------------------------------------
  // PORTFOLIO BUILDER ENGINE (Sections 8, 9, 10)
  // ----------------------------------------------------
  getPortfolios(): Portfolio[] {
    return loadItem<Portfolio[]>(STORAGE_KEYS.PORTFOLIOS, memoryState.portfolios);
  },

  getPortfolioByStudentId(studentId: string): Portfolio | undefined {
    const all = this.getPortfolios();
    return all.find((p) => p.student_id === studentId);
  },

  savePortfolio(portfolioData: Partial<Portfolio> & { student_id: string }): Portfolio {
    const all = this.getPortfolios();
    const existingIndex = all.findIndex((p) => p.student_id === portfolioData.student_id);

    const now = new Date().toISOString();
    let saved: Portfolio;

    if (existingIndex >= 0) {
      saved = {
        ...all[existingIndex],
        ...portfolioData,
        updated_at: now,
      };
      all[existingIndex] = saved;
    } else {
      saved = {
        id: `portfolio-${Date.now()}`,
        student_id: portfolioData.student_id,
        headline: portfolioData.headline || 'Student Freelancer & Creator',
        about: portfolioData.about || '',
        skills: portfolioData.skills || [],
        education: portfolioData.education || '',
        experience: portfolioData.experience || '',
        achievements: portfolioData.achievements || [],
        certifications: portfolioData.certifications || [],
        services_summary: portfolioData.services_summary || '',
        template: portfolioData.template || 'professional',
        status: portfolioData.status || 'draft',
        projects: portfolioData.projects || [],
        updated_at: now,
      };
      all.push(saved);
    }

    memoryState.portfolios = all;
    saveItem(STORAGE_KEYS.PORTFOLIOS, all);
    notifyListeners();
    return saved;
  },

  publishPortfolio(studentId: string) {
    const all = this.getPortfolios();
    const existing = all.find((p) => p.student_id === studentId);
    if (existing) {
      existing.status = 'published';
      existing.updated_at = new Date().toISOString();
      memoryState.portfolios = [...all];
      saveItem(STORAGE_KEYS.PORTFOLIOS, memoryState.portfolios);
      notifyListeners();
    }
  },

  unpublishPortfolio(studentId: string) {
    const all = this.getPortfolios();
    const existing = all.find((p) => p.student_id === studentId);
    if (existing) {
      existing.status = 'draft';
      existing.updated_at = new Date().toISOString();
      memoryState.portfolios = [...all];
      saveItem(STORAGE_KEYS.PORTFOLIOS, memoryState.portfolios);
      notifyListeners();
    }
  },

  deletePortfolio(studentId: string) {
    const all = this.getPortfolios().filter((p) => p.student_id !== studentId);
    memoryState.portfolios = all;
    saveItem(STORAGE_KEYS.PORTFOLIOS, all);
    notifyListeners();
  },

  addProjectToPortfolio(studentId: string, project: Omit<PortfolioProject, 'id'>): PortfolioProject {
    const portfolio = this.getPortfolioByStudentId(studentId) || this.savePortfolio({ student_id: studentId });
    const newProject: PortfolioProject = {
      ...project,
      id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    const updatedProjects = [newProject, ...(portfolio.projects || [])];
    this.savePortfolio({
      ...portfolio,
      projects: updatedProjects,
    });
    return newProject;
  },

  deleteProjectFromPortfolio(studentId: string, projectId: string) {
    const portfolio = this.getPortfolioByStudentId(studentId);
    if (portfolio) {
      const updatedProjects = portfolio.projects.filter((p) => p.id !== projectId);
      this.savePortfolio({
        ...portfolio,
        projects: updatedProjects,
      });
    }
  },

  // ----------------------------------------------------
  // CLIENT REGISTRATION & ONBOARDING (Section 5)
  // ----------------------------------------------------
  registerClient(clientData: Partial<ClientProfile> & { full_name: string; email: string }) {
    const clients = this.getClients();
    const newClientId = `client-${Date.now()}`;
    const newSkillSetuId = clientData.skillsetu_id || `SK-CL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newClient: ClientProfile = {
      id: newClientId,
      email: clientData.email,
      full_name: clientData.full_name,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80`,
      phone: clientData.phone || '+91 98200 00000',
      role: 'client',
      skillsetu_id: newSkillSetuId,
      client_type: clientData.client_type || 'individual',
      organization_name: clientData.organization_name,
      organization_type: clientData.organization_type,
      role_designation: clientData.role_designation,
      website: clientData.website,
      city: clientData.city || 'Mumbai',
      location: clientData.city || 'Mumbai',
      about: clientData.about || 'Client hiring verified student freelancers on SkillSetu.',
      total_spent: 0,
      hired_count: 0,
      rating_given_avg: 5.0,
      verification_status: clientData.verification_status || 'verified',
      is_student_client: clientData.is_student_client || false,
      created_at: new Date().toISOString(),
    };

    const updatedClients = [newClient, ...clients];
    memoryState.clients = updatedClients;
    memoryState.currentClientId = newClientId;
    memoryState.userRole = 'client';

    saveItem(STORAGE_KEYS.CLIENTS, updatedClients);
    saveItem(STORAGE_KEYS.CURRENT_CLIENT_ID, newClientId);
    saveItem(STORAGE_KEYS.CURRENT_USER_ROLE, 'client');

    notifyListeners();
    return newClient;
  },

  logout() {
    memoryState.userRole = 'student';
    saveItem(STORAGE_KEYS.CURRENT_USER_ROLE, 'student');
    notifyListeners();
  },

  // ----------------------------------------------------
  // SERVICES
  // ----------------------------------------------------
  getServices(): Service[] {
    return loadItem<Service[]>(STORAGE_KEYS.SERVICES, memoryState.services);
  },

  getServiceById(id: string): Service | undefined {
    return this.getServices().find((s) => s.id === id);
  },

  addService(service: Omit<Service, 'id' | 'created_at' | 'views_count' | 'bookings_count'>) {
    const all = this.getServices();
    const newService: Service = {
      ...service,
      id: `service-${Date.now()}`,
      created_at: new Date().toISOString(),
      views_count: 0,
      bookings_count: 0,
    };
    const updated = [newService, ...all];
    memoryState.services = updated;
    saveItem(STORAGE_KEYS.SERVICES, updated);
    notifyListeners();
    return newService;
  },

  updateService(id: string, updates: Partial<Service>) {
    const all = this.getServices();
    const updated = all.map((s) => (s.id === id ? { ...s, ...updates } : s));
    memoryState.services = updated;
    saveItem(STORAGE_KEYS.SERVICES, updated);
    notifyListeners();
  },

  deleteService(id: string) {
    const all = this.getServices();
    const updated = all.filter((s) => s.id !== id);
    memoryState.services = updated;
    saveItem(STORAGE_KEYS.SERVICES, updated);
    notifyListeners();
  },

  // ----------------------------------------------------
  // BOOKINGS & 10-STATE MACHINE
  // ----------------------------------------------------
  getBookings(): Booking[] {
    return loadItem<Booking[]>(STORAGE_KEYS.BOOKINGS, memoryState.bookings);
  },

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  createBooking(data: {
    service_id: string;
    booking_date: string;
    time_slot: string;
    duration_hours: number;
    message?: string;
  }): Booking {
    const service = this.getServiceById(data.service_id);
    const client = this.getCurrentClient();

    if (!service) throw new Error('Service not found');

    const servicePrice = service.price * data.duration_hours;
    const platformFee = Math.round(servicePrice * SITE_CONFIG.platformFeeRate);
    const totalAmount = servicePrice + platformFee;

    const randomCode = Math.floor(10000 + Math.random() * 90000);

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      booking_code: `RAS-${randomCode}`,
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
      booking_date: data.booking_date,
      time_slot: data.time_slot,
      duration_hours: data.duration_hours,
      message: data.message,
      service_price: servicePrice,
      platform_fee: platformFee,
      total_amount: totalAmount,
      status: 'ACTIVE',
      payment_status: 'PROTECTED',
      created_at: new Date().toISOString(),
    };

    const all = this.getBookings();
    const updated = [newBooking, ...all];
    memoryState.bookings = updated;
    saveItem(STORAGE_KEYS.BOOKINGS, updated);

    // Increment service bookings count
    this.updateService(service.id, { bookings_count: service.bookings_count + 1 });

    // Notify student of new booking
    this.addNotification({
      user_id: service.student_id,
      type: 'booking',
      title: 'New Booking Confirmed & Protected',
      message: `${client.full_name} booked "${service.title}" for ${data.booking_date}. Funds are safely protected.`,
      link_url: '/bookings',
    });

    notifyListeners();
    return newBooking;
  },

  updateBookingStatus(bookingId: string, status: BookingStatus, paymentStatus?: PaymentStatus) {
    const all = this.getBookings();
    const updated = all.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status,
          payment_status: paymentStatus || b.payment_status,
          updated_at: new Date().toISOString(),
        };
      }
      return b;
    });

    memoryState.bookings = updated;
    saveItem(STORAGE_KEYS.BOOKINGS, updated);
    notifyListeners();
  },

  // ----------------------------------------------------
  // REVIEWS
  // ----------------------------------------------------
  getReviews(): Review[] {
    return loadItem<Review[]>(STORAGE_KEYS.REVIEWS, memoryState.reviews);
  },

  addReview(data: {
    booking_id: string;
    service_id: string;
    student_id: string;
    rating: number;
    review_text: string;
  }) {
    const client = this.getCurrentClient();
    const all = this.getReviews();

    // Prevent duplicate reviews for same booking
    if (all.some((r) => r.booking_id === data.booking_id)) {
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      booking_id: data.booking_id,
      service_id: data.service_id,
      student_id: data.student_id,
      client_id: client.id,
      client_name: client.full_name,
      client_org: client.organization_name,
      client_avatar: client.avatar_url,
      rating: data.rating,
      review_text: data.review_text,
      created_at: new Date().toISOString(),
    };

    const updated = [newReview, ...all];
    memoryState.reviews = updated;
    saveItem(STORAGE_KEYS.REVIEWS, updated);

    // Update booking status to REVIEWED/CONFIRMED
    this.updateBookingStatus(data.booking_id, 'CONFIRMED_BY_CLIENT', 'RELEASED');

    // Notify student
    this.addNotification({
      user_id: data.student_id,
      type: 'review',
      title: 'New Client Review Received',
      message: `${client.full_name} left a ${data.rating}-star review on your completed service.`,
      link_url: '/reviews',
    });

    notifyListeners();
    return newReview;
  },

  // ----------------------------------------------------
  // COMMUNITY
  // ----------------------------------------------------
  getCommunityPosts(): CommunityPost[] {
    return loadItem<CommunityPost[]>(STORAGE_KEYS.COMMUNITY_POSTS, memoryState.communityPosts);
  },

  addCommunityPost(post: Omit<CommunityPost, 'id' | 'created_at' | 'responses_count'>) {
    const all = this.getCommunityPosts();
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      responses_count: 0,
      created_at: new Date().toISOString(),
    };
    const updated = [newPost, ...all];
    memoryState.communityPosts = updated;
    saveItem(STORAGE_KEYS.COMMUNITY_POSTS, updated);
    notifyListeners();
    return newPost;
  },

  getCommunityResponses(postId?: string): CommunityResponse[] {
    const all = loadItem<CommunityResponse[]>(STORAGE_KEYS.COMMUNITY_RESPONSES, memoryState.communityResponses);
    return postId ? all.filter((r) => r.post_id === postId) : all;
  },

  addCommunityResponse(data: {
    post_id: string;
    proposal_text: string;
    proposed_rate: number;
  }) {
    const student = this.getCurrentStudent();
    const all = this.getCommunityResponses();

    const newResponse: CommunityResponse = {
      id: `resp-${Date.now()}`,
      post_id: data.post_id,
      student_id: student.id,
      student_name: student.full_name,
      student_avatar: student.avatar_url,
      student_college: student.college,
      proposal_text: data.proposal_text,
      proposed_rate: data.proposed_rate,
      status: 'applied',
      created_at: new Date().toISOString(),
    };

    const updated = [newResponse, ...all];
    memoryState.communityResponses = updated;
    saveItem(STORAGE_KEYS.COMMUNITY_RESPONSES, updated);

    // Increment post response count
    const posts = this.getCommunityPosts();
    const updatedPosts = posts.map((p) => (p.id === data.post_id ? { ...p, responses_count: p.responses_count + 1 } : p));
    memoryState.communityPosts = updatedPosts;
    saveItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);

    notifyListeners();
    return newResponse;
  },

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  getNotifications(): NotificationItem[] {
    return loadItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, memoryState.notifications);
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) {
    const all = this.getNotifications();
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    const updated = [newItem, ...all];
    memoryState.notifications = updated;
    saveItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    notifyListeners();
    return newItem;
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

  // ----------------------------------------------------
  // DISPUTES
  // ----------------------------------------------------
  getDisputes(): Dispute[] {
    return loadItem<Dispute[]>(STORAGE_KEYS.DISPUTES, memoryState.disputes);
  },

  raiseDispute(data: {
    booking_id: string;
    issue_type: string;
    description: string;
  }) {
    const booking = this.getBookingById(data.booking_id);
    const role = this.getUserRole();
    const user = role === 'student' ? this.getCurrentStudent() : this.getCurrentClient();

    if (!booking) throw new Error('Booking not found');

    const newDispute: Dispute = {
      id: `dispute-${Date.now()}`,
      booking_id: booking.id,
      booking_code: booking.booking_code,
      raised_by_id: user.id,
      raised_by_name: user.full_name,
      raised_by_role: role,
      issue_type: data.issue_type,
      description: data.description,
      status: 'reported',
      created_at: new Date().toISOString(),
    };

    const all = this.getDisputes();
    const updated = [newDispute, ...all];
    memoryState.disputes = updated;
    saveItem(STORAGE_KEYS.DISPUTES, updated);

    // Update booking status
    this.updateBookingStatus(booking.id, 'DISPUTED');

    notifyListeners();
    return newDispute;
  },

  resolveDispute(disputeId: string, action: 'release' | 'refund') {
    const all = this.getDisputes();
    const dispute = all.find((d) => d.id === disputeId);

    if (dispute) {
      const updated = all.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: action === 'release' ? ('released' as const) : ('refunded' as const),
              resolved_at: new Date().toISOString(),
            }
          : d
      );
      memoryState.disputes = updated;
      saveItem(STORAGE_KEYS.DISPUTES, updated);

      this.updateBookingStatus(
        dispute.booking_id,
        'RESOLVED',
        action === 'release' ? 'RELEASED' : 'REFUNDED'
      );

      notifyListeners();
    }
  },

  // ----------------------------------------------------
  // VERIFICATIONS
  // ----------------------------------------------------
  getVerifications(): StudentVerification[] {
    return loadItem<StudentVerification[]>(STORAGE_KEYS.VERIFICATIONS, memoryState.verifications);
  },

  submitStudentVerification(data: {
    college: string;
    course: string;
    year: string;
    collegeIdNumber: string;
    collegeEmail: string;
    idCardDocUrl?: string;
  }) {
    const student = this.getCurrentStudent();
    const all = this.getVerifications();

    const newVerif: StudentVerification = {
      id: `verif-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      college: data.college,
      course: data.course,
      year: data.year,
      college_id_number: data.collegeIdNumber,
      college_email: data.collegeEmail,
      id_card_doc_url: data.idCardDocUrl,
      status: 'verified', // Instant verified for demo experience
      submitted_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString(),
    };

    const updated = [newVerif, ...all];
    memoryState.verifications = updated;
    saveItem(STORAGE_KEYS.VERIFICATIONS, updated);

    // Update current student profile
    const students = this.getStudents();
    const updatedStudents = students.map((s) => {
      if (s.id === student.id) {
        return {
          ...s,
          college: data.college,
          course: data.course,
          year: data.year,
          verification_status: 'verified' as VerificationStatus,
          id_card_doc_url: data.idCardDocUrl || s.id_card_doc_url,
          badges: s.badges.includes('Verified Student') ? s.badges : ['Verified Student', ...s.badges],
        };
      }
      return s;
    });

    memoryState.students = updatedStudents;
    saveItem(STORAGE_KEYS.STUDENTS, updatedStudents);

    notifyListeners();
    return newVerif;
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

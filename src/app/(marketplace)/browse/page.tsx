'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { CATEGORIES } from '@/config/site';
import { Service } from '@/types';
import { useSkillSetuStore } from '@/lib/data/store';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { FilterSidebar, FilterState } from '@/components/marketplace/FilterSidebar';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const store = useSkillSetuStore();
  const services = store.getServices();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'top_rated' | 'most_booked' | 'price_asc' | 'price_desc' | 'newest'>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    maxPrice: 3000,
    deliveryMode: 'all',
    minRating: 0,
    verifiedOnly: false,
  });

  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      maxPrice: 3000,
      deliveryMode: 'all',
      minRating: 0,
      verifiedOnly: false,
    });
    setSearchQuery('');
  };

  const handleBookClick = (service: Service) => {
    setSelectedServiceForBooking(service);
    setBookingModalOpen(true);
  };

  // Filter & Sort Pipeline
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (s.status !== 'published') return false;

      // Category filter
      if (filters.category !== 'All' && s.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesStudent = s.student_name.toLowerCase().includes(q);
        const matchesCollege = s.student_college.toLowerCase().includes(q);
        const matchesCategory = s.category.toLowerCase().includes(q);
        const matchesSkills = s.skills.some((sk) => sk.toLowerCase().includes(q));
        if (!matchesTitle && !matchesStudent && !matchesCollege && !matchesCategory && !matchesSkills) {
          return false;
        }
      }

      // Price filter
      if (s.price > filters.maxPrice) return false;

      // Delivery mode filter
      if (filters.deliveryMode !== 'all') {
        if (filters.deliveryMode === 'online' && s.delivery_mode !== 'online' && s.delivery_mode !== 'both') return false;
        if (filters.deliveryMode === 'on_campus' && s.delivery_mode !== 'on_campus' && s.delivery_mode !== 'both') return false;
      }

      // Minimum rating filter
      if (filters.minRating > 0 && s.student_rating < filters.minRating) return false;

      // Verified only filter
      if (filters.verifiedOnly && !s.student_badges.includes('Verified Student')) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'top_rated':
          return b.student_rating - a.student_rating;
        case 'most_booked':
          return b.bookings_count - a.bookings_count;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'recommended':
        default:
          return b.views_count + b.bookings_count * 5 - (a.views_count + a.bookings_count * 5);
      }
    });
  }, [services, filters, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Browse Skills & Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Find verified student talent for your project, event, business or learning needs.
        </p>
      </div>

      {/* Search & Top Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search skills, services, students or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50/70 border-slate-200 focus:bg-white text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="top_rated">Top Rated</option>
                <option value="most_booked">Most Booked</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen((prev) => !prev)}
              className="lg:hidden h-10 px-3 font-semibold text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
              Filters
            </Button>
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, category: 'All' }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filters.category === 'All'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, category: cat.name }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filters.category.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Services Results Grid */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredServices.length}</strong> verified student services
            </span>
            {(filters.category !== 'All' || searchQuery || filters.deliveryMode !== 'all' || filters.minRating > 0 || filters.verifiedOnly) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters
              </button>
            )}
          </div>

          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t find any student services matching your search or active filters. Try broadening your criteria.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookClick={handleBookClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Checkout Modal */}
      <BookingModal
        service={selectedServiceForBooking}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
      />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-10 text-center text-xs text-slate-400">Loading marketplace...</div>}>
      <BrowseContent />
    </Suspense>
  );
}

'use client';

import React from 'react';
import { CATEGORIES } from '@/config/site';
import { DeliveryMode } from '@/types';
import { Filter, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FilterState {
  category: string;
  maxPrice: number;
  deliveryMode: string;
  minRating: number;
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  className = '',
}: FilterSidebarProps) {
  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside className={`w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-sm text-slate-900">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => update({ category: 'All' })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
              filters.category === 'All'
                ? 'bg-orange-50 text-orange-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'All' && <Check className="w-3.5 h-3.5 text-orange-600" />}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => update({ category: cat.name })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                filters.category.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category.toLowerCase() === cat.name.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-orange-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Mode */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Delivery Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'online', label: 'Online' },
            { id: 'on_campus', label: 'Campus' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => update({ deliveryMode: mode.id })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                filters.deliveryMode === mode.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-extrabold text-orange-600">
            ₹{filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min={200}
          max={3000}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          className="w-full accent-orange-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <span>₹200</span>
          <span>₹3,000+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 4.0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => update({ minRating: rating })}
              className={`py-1.5 px-1 rounded-lg text-xs font-bold border transition-all ${
                filters.minRating === rating
                  ? 'bg-orange-50 text-orange-700 border-orange-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {rating === 0 ? 'Any' : `${rating}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Only Toggle */}
      <div className="border-t border-slate-100 pt-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900">
              Verified Talent Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => update({ verifiedOnly: e.target.checked })}
            className="w-4 h-4 accent-emerald-600 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
}

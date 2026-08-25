import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  reviewCount,
  showCount = true,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = '',
}: StarRatingProps) {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
              aria-label={`${star} star`}
            >
              <Star
                className={`${iconSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className={`${textSizes[size]} font-bold text-slate-900`}>
        {rating.toFixed(1)}
      </span>

      {showCount && reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-slate-500 font-normal`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}

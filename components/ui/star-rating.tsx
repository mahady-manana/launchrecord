'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onValueChange: (value: number) => void;
  maxStars?: number;
}

export function StarRating({ value, onValueChange, maxStars = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number) => {
    onValueChange(index);
  };

  const handleMouseEnter = (index: number) => {
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = hoverValue !== null ? starValue <= hoverValue : starValue <= value;

        return (
          <button
            key={index}
            type="button"
            className={`p-0 m-0 cursor-pointer ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={`w-6 h-6 ${isFilled ? 'fill-current' : ''}`}
            />
          </button>
        );
      })}
    </div>
  );
}
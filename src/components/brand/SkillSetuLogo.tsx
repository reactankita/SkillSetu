import React from 'react';
import Link from 'next/link';

interface SkillSetuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light' | 'mono';
  href?: string;
}

export function SkillSetuLogo({
  className = '',
  size = 'md',
  variant = 'dark',
  href = '/',
}: SkillSetuLogoProps) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const Content = (
    <div className={`inline-flex items-center gap-2 font-bold tracking-tight select-none ${className}`}>
      {/* Geometric Bridge / Setu Connector Mark */}
      <svg
        className={`${iconSizes[size]} transition-transform duration-200 group-hover:scale-105`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left anchor node */}
        <circle cx="8" cy="16" r="4.5" fill="#0B1727" />
        {/* Right anchor node */}
        <circle cx="24" cy="16" r="4.5" fill="#EA580C" />
        {/* Bridging interconnecting arch */}
        <path
          d="M8 16C12 9 20 9 24 16"
          stroke="#0B1727"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M8 16C12 23 20 23 24 16"
          stroke="#EA580C"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Central nexus dot */}
        <circle cx="16" cy="16" r="2.5" fill={variant === 'light' ? '#FFFFFF' : '#0D9488'} />
      </svg>

      <span className={`${textSizes[size]} font-extrabold tracking-tight leading-none`}>
        <span className={variant === 'light' ? 'text-white' : 'text-slate-900'}>Skill</span>
        <span className="text-orange-600">Setu</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center focus:outline-none">
        {Content}
      </Link>
    );
  }

  return Content;
}

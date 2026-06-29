import React from "react";

// 1. Top Rank Monthly (Gold circular medal with a ribbon tail and "1" in the center)
export const TopRankBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ribbon tails */}
    <path d="M15 24l-3 12 8-4 8 4-3-12" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    <path d="M25 24l3 12-8-4-8 4 3-12" fill="#B45309" stroke="#92400E" strokeWidth="1" />
    {/* Circle Medal */}
    <circle cx="20" cy="18" r="12" fill="url(#goldGrad)" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="20" cy="18" r="9" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="2 1.5" />
    <text x="20" y="22" fill="#78350F" fontSize="11" fontWeight="extrabold" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">1</text>
    <defs>
      <linearGradient id="goldGrad" x1="8" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. Weekly Top (Purple medal with a ribbon tail and star in the center)
export const WeeklyTopBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ribbon tails */}
    <path d="M15 24l-3 12 8-4 8 4-3-12" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1" />
    <path d="M25 24l3 12-8-4-8 4 3-12" fill="#6D28D9" stroke="#5B21B6" strokeWidth="1" />
    {/* Circle Medal */}
    <circle cx="20" cy="18" r="12" fill="url(#purpleGrad)" stroke="#8B5CF6" strokeWidth="2" />
    <polygon points="20,13 22.2,17.2 26.8,17.6 23.4,20.6 24.5,25.2 20,22.8 15.5,25.2 16.6,20.6 13.2,17.6 17.8,17.2" fill="white" />
    <defs>
      <linearGradient id="purpleGrad" x1="8" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DDD6FE" />
        <stop offset="0.5" stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#6D28D9" />
      </linearGradient>
    </defs>
  </svg>
);

// 3. Consistent Trader (Green shield with star in the center)
export const ConsistentTraderBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#greenGrad)" stroke="#10B981" strokeWidth="2" />
    <circle cx="20" cy="18" r="4.5" fill="none" stroke="#A7F3D0" strokeWidth="1" strokeDasharray="1.5 1" />
    <polygon points="20,13 21.8,16.5 25.5,17 22.7,19.5 23.5,23.2 20,21.3 16.5,23.2 17.3,19.5 14.5,17 18.2,16.5" fill="white" />
    <defs>
      <linearGradient id="greenGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A7F3D0" />
        <stop offset="0.5" stopColor="#10B981" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
  </svg>
);

// 4. Most Active Trader (Blue shield with star in the center)
export const MostActiveTraderBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#blueGrad)" stroke="#3B82F6" strokeWidth="2" />
    <circle cx="20" cy="18" r="4.5" fill="none" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="1.5 1" />
    <polygon points="20,13 21.8,16.5 25.5,17 22.7,19.5 23.5,23.2 20,21.3 16.5,23.2 17.3,19.5 14.5,17 18.2,16.5" fill="white" />
    <defs>
      <linearGradient id="blueGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BFDBFE" />
        <stop offset="0.5" stopColor="#3B82F6" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
);

// 5. Trader of the Week (Brown/Bronze medal with a ribbon tail and star in the center)
export const TraderOfWeekBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ribbon tails */}
    <path d="M15 24l-3 12 8-4 8 4-3-12" fill="#B45309" stroke="#78350F" strokeWidth="1" />
    <path d="M25 24l3 12-8-4-8 4 3-12" fill="#92400E" stroke="#78350F" strokeWidth="1" />
    {/* Circle Medal */}
    <circle cx="20" cy="18" r="12" fill="url(#bronzeGrad)" stroke="#D97706" strokeWidth="2" />
    <polygon points="20,13 22.2,17.2 26.8,17.6 23.4,20.6 24.5,25.2 20,22.8 15.5,25.2 16.6,20.6 13.2,17.6 17.8,17.2" fill="white" />
    <defs>
      <linearGradient id="bronzeGrad" x1="8" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDBA74" />
        <stop offset="0.5" stopColor="#D97706" />
        <stop offset="1" stopColor="#78350F" />
      </linearGradient>
    </defs>
  </svg>
);

// 6. Best Risk Manager (Teal/Cyan shield with star in the center)
export const BestRiskManagerBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#cyanGrad)" stroke="#14B8A6" strokeWidth="2" />
    <circle cx="20" cy="18" r="4.5" fill="none" stroke="#CCFBF1" strokeWidth="1" strokeDasharray="1.5 1" />
    <polygon points="20,13 21.8,16.5 25.5,17 22.7,19.5 23.5,23.2 20,21.3 16.5,23.2 17.3,19.5 14.5,17 18.2,16.5" fill="white" />
    <defs>
      <linearGradient id="cyanGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#CCFBF1" />
        <stop offset="0.5" stopColor="#14B8A6" />
        <stop offset="1" stopColor="#0F766E" />
      </linearGradient>
    </defs>
  </svg>
);

// Helper function to render a badge component by its name string
export function renderBadgeIcon(badgeName: string, className = "w-10 h-10") {
  switch (badgeName) {
    case "Top Rank Monthly":
      return <TopRankBadge className={className} />;
    case "Weekly Top":
      return <WeeklyTopBadge className={className} />;
    case "Consistent Trader":
      return <ConsistentTraderBadge className={className} />;
    case "Most Active Trader":
      return <MostActiveTraderBadge className={className} />;
    case "Trader of the Week":
      return <TraderOfWeekBadge className={className} />;
    case "Best Risk Manager":
      return <BestRiskManagerBadge className={className} />;
    default:
      return null;
  }
}

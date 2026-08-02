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

// 7. Final Winner Trophy (Glowing golden trophy)
export const FinalWinnerTrophy = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base */}
    <path d="M14 32h12v2H14v-2z" fill="#B45309" />
    <path d="M17 28h6v4h-6v-4z" fill="#D97706" />
    {/* Handles */}
    <path d="M12 16c-3 0-3 6 0 6h2v-2h-2c-1.5 0-1.5-4 0-4h2v-2h-2z" fill="url(#trophyGoldGrad)" />
    <path d="M28 16c3 0 3 6 0 6h-2v-2h2c1.5 0 1.5-4 0-4h-2v-2h2z" fill="url(#trophyGoldGrad)" />
    {/* Cup */}
    <path d="M13 12h14l-1 12c-1.5 4.5-5 5-6 5s-4.5-.5-6-5l-1-12z" fill="url(#trophyGoldGrad)" stroke="#F59E0B" strokeWidth="1" />
    <ellipse cx="20" cy="12" rx="7" ry="1.5" fill="#B45309" />
    <polygon points="20,15 21.5,19 25.5,19 22.3,21.5 23.5,25.5 20,23 16.5,25.5 17.7,21.5 14.5,19 18.5,19" fill="#FFF" opacity="0.9" />
    <defs>
      <linearGradient id="trophyGoldGrad" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#92400E" />
      </linearGradient>
    </defs>
  </svg>
);

// 8. Next Evaluations (Purple square clock)
export const NextEvaluationsBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="28" height="28" rx="8" fill="url(#purpleSquareGrad)" stroke="#A78BFA" strokeWidth="2" />
    <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" fill="none" />
    <path d="M20 16v4h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="purpleSquareGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C4B5FD" />
        <stop offset="0.5" stopColor="#7C3AED" />
        <stop offset="1" stopColor="#5B21B6" />
      </linearGradient>
    </defs>
  </svg>
);

// 9. Challenge Champion (Purple shield with trophy)
export const ChallengeChampionBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#purpleShieldGrad)" stroke="#8B5CF6" strokeWidth="2" />
    <path d="M15 15h10v2c0 2-1.5 4-5 4s-5-2-5-4v-2z" fill="white" />
    <path d="M18 21h4v4h-4v-4z" fill="white" opacity="0.9" />
    <path d="M16 25h8v1.5H16V25z" fill="white" opacity="0.9" />
    <path d="M13 16c-1.5 0-1.5 3 0 3h2v-3h-2z" fill="white" opacity="0.8" />
    <path d="M27 16c1.5 0 1.5 3 0 3h-2v-3h2z" fill="white" opacity="0.8" />
    <defs>
      <linearGradient id="purpleShieldGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DDD6FE" />
        <stop offset="0.5" stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#5B21B6" />
      </linearGradient>
    </defs>
  </svg>
);

// 10. Profit Master (Blue shield with chart)
export const ProfitMasterBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#blueShieldGrad)" stroke="#2563EB" strokeWidth="2" />
    <rect x="14" y="21" width="2.5" height="4" rx="0.5" fill="white" />
    <rect x="18" y="18" width="2.5" height="7" rx="0.5" fill="white" />
    <rect x="22" y="14" width="2.5" height="11" rx="0.5" fill="white" />
    <path d="M14 21l4-3 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 14h3v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="blueShieldGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DBEAFE" />
        <stop offset="0.5" stopColor="#2563EB" />
        <stop offset="1" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
  </svg>
);

// 11. Elite Trader (Gold shield with crown)
export const EliteTraderBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#goldShieldGrad)" stroke="#F59E0B" strokeWidth="2" />
    <path d="M14 24h12l1.5-8-4 3-3.5-5-3.5 5-4-3 1.5 8z" fill="white" />
    <circle cx="14" cy="15.5" r="0.8" fill="#F59E0B" />
    <circle cx="20" cy="13.5" r="0.8" fill="#F59E0B" />
    <circle cx="26" cy="15.5" r="0.8" fill="#F59E0B" />
    <defs>
      <linearGradient id="goldShieldGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

// 12. Community Leader (Teal hexagon with group)
export const CommunityLeaderBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(13,148,136,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5l12.1 7v16L20 35l-12.1-7V12L20 5z" fill="url(#tealHexGrad)" stroke="#0D9488" strokeWidth="2" />
    <circle cx="20" cy="16" r="3" fill="white" />
    <path d="M16 24c0-2.2 1.8-4 4-4s4 1.8 4 4" fill="white" />
    <circle cx="15" cy="18" r="2" fill="white" opacity="0.8" />
    <path d="M12 24.5c0-1.5 1-2.5 3-2.5" fill="white" opacity="0.8" stroke="white" strokeWidth="1.5" />
    <circle cx="25" cy="18" r="2" fill="white" opacity="0.8" />
    <path d="M28 24.5c0-1.5-1-2.5-3-2.5" fill="white" opacity="0.8" stroke="white" strokeWidth="1.5" />
    <defs>
      <linearGradient id="tealHexGrad" x1="20" y1="5" x2="20" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#99F6E4" />
        <stop offset="0.5" stopColor="#0D9488" />
        <stop offset="1" stopColor="#0F766E" />
      </linearGradient>
    </defs>
  </svg>
);

// 13. Hot Streak (Red shield with fire)
export const HotStreakBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#redShieldGrad)" stroke="#DC2626" strokeWidth="2" />
    <path d="M20 12c0 0-4 3.5-4 7s3 6 4 6 4-2.5 4-6-4-7-4-7zm-1.5 9c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-1.5 2.5-1.5 2.5-1.5-1.7-1.5-2.5z" fill="white" />
    <defs>
      <linearGradient id="redShieldGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FECACA" />
        <stop offset="0.5" stopColor="#DC2626" />
        <stop offset="1" stopColor="#991B1B" />
      </linearGradient>
    </defs>
  </svg>
);

// 14. Goal Achiever (Teal/Green shield with checkmark)
export const GoalAchieverBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(13,148,136,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c6 0 10 3 10 11 0 7-6 13-10 17-4-4-10-10-10-17 0-8 4-11 10-11z" fill="url(#tealCheckShieldGrad)" stroke="#0D9488" strokeWidth="2" />
    <circle cx="20" cy="18" r="6" stroke="white" strokeWidth="2" fill="none" />
    <path d="M17.5 18l2 2 3-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="tealCheckShieldGrad" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#99F6E4" />
        <stop offset="0.5" stopColor="#0D9488" />
        <stop offset="1" stopColor="#115E59" />
      </linearGradient>
    </defs>
  </svg>
);

// 15. Rising Star (Silver medal with star)
export const RisingStarBadge = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]`} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 24l-3 12 8-4 8 4-3-12" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
    <path d="M25 24l3 12-8-4-8 4 3-12" fill="#64748B" stroke="#475569" strokeWidth="1" />
    <circle cx="20" cy="18" r="12" fill="url(#silverGrad)" stroke="#94A3B8" strokeWidth="2" />
    <polygon points="20,13 22.2,17.2 26.8,17.6 23.4,20.6 24.5,25.2 20,22.8 15.5,25.2 16.6,20.6 13.2,17.6 17.8,17.2" fill="white" />
    <defs>
      <linearGradient id="silverGrad" x1="8" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F1F5F9" />
        <stop offset="0.5" stopColor="#CBD5E1" />
        <stop offset="1" stopColor="#64748B" />
      </linearGradient>
    </defs>
  </svg>
);

// Helper function to render a badge component by its name string or icon string key
export function renderBadgeIcon(iconKey: string, className = "w-10 h-10") {
  switch (iconKey) {
    case "medal_gold":
    case "Top Rank Monthly":
    case "Top Rank":
      return <TopRankBadge className={className} />;
    case "Weekly Top":
    case "high_performer":
    case "High Performer":
      return <WeeklyTopBadge className={className} />;
    case "shield_green":
    case "Consistent Trader":
      return <ConsistentTraderBadge className={className} />;
    case "shield_blue":
    case "Most Active Trader":
      return <MostActiveTraderBadge className={className} />;
    case "shield_orange":
    case "Trader of the Week":
      return <TraderOfWeekBadge className={className} />;
    case "shield_cyan":
    case "Best Risk Manager":
      return <BestRiskManagerBadge className={className} />;
    case "trophy":
    case "Final Winner":
    case "Ultimate FX Champion":
      return <FinalWinnerTrophy className={className} />;
    case "clock_purple":
    case "Next Evaluations":
    case "Next Evaluation":
      return <NextEvaluationsBadge className={className} />;
    case "shield_purple_trophy":
    case "Challenge Champion":
      return <ChallengeChampionBadge className={className} />;
    case "shield_blue_chart":
    case "Profit Master":
      return <ProfitMasterBadge className={className} />;
    case "shield_gold_crown":
    case "Elite Trader":
      return <EliteTraderBadge className={className} />;
    case "hexagon_teal_group":
    case "Community Leader":
      return <CommunityLeaderBadge className={className} />;
    case "shield_red_fire":
    case "Hot Streak":
      return <HotStreakBadge className={className} />;
    case "shield_green_check":
    case "Goal Achiever":
      return <GoalAchieverBadge className={className} />;
    case "medal_silver_star":
    case "Rising Star":
      return <RisingStarBadge className={className} />;
    default:
      return <ConsistentTraderBadge className={className} />;
  }
}

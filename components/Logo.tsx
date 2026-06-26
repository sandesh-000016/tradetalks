import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center font-display font-extrabold text-xl tracking-tight text-white ${className}`}>
      Trade<span className="text-brand-400 ml-0.5">Talks</span>
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 ml-1 animate-pulse"></span>
    </div>
  );
}

import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="TradeTalks Logo"
      className={`h-18 w-auto object-contain ${className}`}
    />
  );
}

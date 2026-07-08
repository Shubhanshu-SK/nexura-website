"use client";

import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`bg-nx-surface/60 backdrop-blur-xl border border-nx-purple/25 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-nx-orchid/50 ${className}`}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function AuroraBackground({
  children,
  className = "",
}: AuroraBackgroundProps) {
  return (
    <div className={`aurora-background relative overflow-hidden ${className}`}>
      <div className="aurora-background__layer pointer-events-none absolute inset-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

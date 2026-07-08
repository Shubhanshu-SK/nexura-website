"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

interface RadialGlowButtonProps {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-4 text-xs rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-[3.25rem] px-8 text-base rounded-xl",
} as const;

const transitionClass =
  "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

const defaultGradient =
  "radial-gradient(130% 170% at 40% 140%, #2a0040 37%, #6B12A0 61%, #AA27E5 78%, #CC55FF 94%, #1a0030 100%)";

const defaultGradientHover =
  "radial-gradient(130% 170% at 50% 120%, #2a0040 37%, #6B12A0 61%, #AA27E5 78%, #CC55FF 94%, #1a0030 100%)";

const borderGradient =
  "linear-gradient(135deg, #6B12A0 0%, #AA27E5 45%, #CC55FF 75%, #1a0030 100%)";

export default function RadialGlowButton({
  variant = "default",
  size = "md",
  children,
  onClick,
  href,
  target,
  className = "",
  disabled = false,
}: RadialGlowButtonProps) {
  const [hovered, setHovered] = useState(false);
  const sizeClass = sizeClasses[size];
  const sharedClasses = `inline-flex items-center justify-center font-medium whitespace-nowrap ${transitionClass} ${sizeClass} ${className}`;

  if (variant === "ghost") {
    const ghostClasses = `${sharedClasses} bg-transparent border border-nx-orchid/40 text-nx-orchid hover:bg-nx-orchid/10 hover:border-nx-orchid hover:-translate-y-0.5`;

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className={ghostClasses}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }

    return (
      <button type="button" onClick={onClick} className={ghostClasses}>
        {children}
      </button>
    );
  }

  const innerClasses = `${sharedClasses} w-full text-white`;
  const innerStyle: CSSProperties = {
    background: hovered ? defaultGradientHover : defaultGradient,
  };

  const borderWrapperClasses = `inline-flex p-px ${transitionClass} hover:-translate-y-0.5 ${sizeClass}`;
  const hoverHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (href) {
    return (
      <span
        className={borderWrapperClasses}
        // style={{ background: borderGradient }}
        {...hoverHandlers}
      >
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className={innerClasses}
          style={innerStyle}
          onClick={onClick}
        >
          {children}
        </a>
      </span>
    );
  }

  return (
    <span
      className={`${borderWrapperClasses} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      // style={{ background: defaultGradientHover }}
      {...hoverHandlers}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={innerClasses}
        style={innerStyle}
      >
        {children}
      </button>
    </span>
  );
}

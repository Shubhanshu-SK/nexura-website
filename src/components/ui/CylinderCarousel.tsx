"use client"
import React from "react"
import { cn } from "@/lib/utils"

export interface CarouselCard {
  imageSrc?: string
  imageAlt?: string
  name: string
  role: string
  initials: string
  gradientFrom: string
  gradientTo: string
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  cards: CarouselCard[]
  containerClassName?: string
  cardClassName?: string
  animationDuration?: number
  cardWidth?: number
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  ({
    cards,
    className,
    containerClassName,
    cardClassName,
    animationDuration = 32,
    cardWidth = 220,
    ...props
  }, ref) => {
    const N = cards.length

    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[480px] grid place-items-center overflow-hidden",
          className
        )}
        style={{
          perspective: "40em",
          maskImage: "linear-gradient(90deg, transparent, #000 18% 82%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 18% 82%, transparent)",
        }}
        {...props}
      >
        <style>{`
          @keyframes ry {
            to { transform: rotateY(1turn); }
          }
          .nx-member-card img {
            filter: grayscale(100%);
            transition: filter 0.4s ease;
          }
          .nx-member-card:hover img {
            filter: grayscale(0%);
          }
          .nx-member-card {
            transition: border-color 0.3s ease;
          }
          .nx-member-card:hover {
            border-color: rgba(170, 39, 229, 0.6) !important;
          }
        `}</style>

        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d]",
            "motion-reduce:![animation-duration:128s]",
            containerClassName
          )}
          style={{
            ...customStyle,
            animation: "ry var(--anim-dur) linear infinite",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className={cn(
                "nx-member-card",
                "[grid-area:1/1] [backface-visibility:hidden]",
                "rounded-2xl overflow-hidden relative",
                "border border-nx-purple/25",
                cardClassName
              )}
              style={{
                width: "var(--w)",
                aspectRatio: "7/10",
                "--i": i,
                transform: "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
              } as React.CSSProperties}
            >
              {/* LAYER 1 — Photo or gradient bg */}
              {card.imageSrc ? (
                <img
                  src={card.imageSrc}
                  alt={card.imageAlt || card.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`
                  }}
                />
              )}

              {/* LAYER 2 — Gradient overlay for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(8,5,14,0.96) 0%, rgba(8,5,14,0.55) 40%, rgba(8,5,14,0.1) 70%, transparent 100%)"
                }}
              />

              {/* LAYER 3 — Initials (only shown when no photo) */}
              {!card.imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center pb-16">
                  <span className="text-white font-outfit font-bold text-4xl opacity-60">
                    {card.initials}
                  </span>
                </div>
              )}

              {/* LAYER 4 — Text bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-nx-text text-3xl font-semibold font-outfit leading-tight mb-0.5">
                  {card.name}
                </p>
                <p className="text-nx-muted text-[18
                px] leading-snug">
                  {card.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
CylinderCarousel.displayName = "CylinderCarousel"
export default CylinderCarousel

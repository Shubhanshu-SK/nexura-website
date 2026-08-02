"use client"

import { motion, useTransform, MotionValue } from "framer-motion"
import RadialGlowButton from "@/components/ui/RadialGlowButton"
import { IEvent } from "@/types"

interface ExtendedEvent extends IEvent {
  mode?: string
}

interface EventCardProps {
  event: ExtendedEvent
  i: number
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

export default function EventCard({
  event,
  i,
  progress,
  range,
  targetScale
}: EventCardProps) {
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div className="sticky top-0 flex items-center justify-center pt-24">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 30 + 220}px)`,
        }}
        className="rounded-2xl w-full max-w-[640px] mx-4 overflow-hidden relative"
      >
        {/* GlassCard styles applied inline */}
        <div
          className="h-full bg-nx-surface/80 backdrop-blur-xl border border-nx-purple/25 rounded-2xl overflow-hidden relative"
          style={{
            backgroundImage: event.imageUrl ? `linear-gradient(to bottom, rgba(15, 10, 29, 0.85), rgba(15, 10, 29, 0.95)), url(${event.imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top color strip */}
          <div
            className="h-1.5 w-full flex-shrink-0"
            style={{ background: event.stripbg || "#AA27E5" }}
          />

          {/* Card body */}
          <div className="flex h-[340px]">
            {/* LEFT */}
            <div className="flex-1 p-6 flex flex-col justify-between z-10">
              <div>
                <p className="text-nx-muted text-[10px] uppercase tracking-widest mb-2 font-medium">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
                <h3 className="text-nx-text font-outfit font-bold text-xl leading-tight mb-3">
                  {event.name}
                </h3>
                <p className="text-nx-muted text-xs leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto flex-wrap">
                <span className="bg-nx-purple/20 text-nx-orchid text-[10px] px-2.5 py-1 rounded-full border border-nx-purple/30 font-medium">
                  {event.mode || "Online"}
                </span>
                <span className="text-nx-muted text-xs">{event.time}</span>
                <span className="text-nx-muted text-xs">by {event.organizedBy}</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-48 flex-shrink-0 border-l border-nx-purple/15 flex flex-col items-center justify-center gap-5 p-6 z-10 bg-nx-surface/30 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-nx-text text-xs font-semibold mb-0.5">{event.venue}</p>
                <p className="text-nx-muted text-[10px]">{event.place}</p>
              </div>

              {event.registrationLink ? (
                <RadialGlowButton
                  size="sm"
                  href={event.registrationLink}
                  target="_blank"
                >
                  Register →
                </RadialGlowButton>
              ) : (
                <RadialGlowButton size="sm" href={`/register?eventId=${event._id}`}>
                  Register →
                </RadialGlowButton>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

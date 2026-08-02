"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import SectionHeader from "@/components/ui/SectionHeader"
import GlassCard from "@/components/ui/GlassCard"
import AuroraBackground from "@/components/ui/AuroraBackground"
import { IEvent } from "@/types"

interface EventsPageClientProps {
  events: IEvent[]
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function EventsPageClient({ events }: EventsPageClientProps) {
  const upcoming = events.filter((e) => e.status === "Upcoming")
  const completed = events.filter((e) => e.status === "Completed")

  const renderGrid = (list: IEvent[], label: string) => (
    <div className="mb-16">
      <h2 className="text-nx-orchid text-[11px] uppercase tracking-[3px] font-medium mb-8">
        {label}
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {list.map((event) => (
          <EventGridCard key={event._id} event={event} />
        ))}
      </motion.div>
    </div>
  )

  return (
    <main className="bg-nx-bg min-h-screen">
      {/* Header */}
      <AuroraBackground className="pt-28 pb-16 px-4">
        <div className="text-center">
          <SectionHeader
            eyebrow="What's happening"
            title="Events"
            subtitle="Workshops, competitions, and everything in between"
            centered
          />
        </div>
      </AuroraBackground>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {events.length === 0 && (
          <div className="flex justify-center mt-8">
            <GlassCard className="max-w-sm w-full p-12 text-center">
              <Calendar size={48} className="text-nx-orchid mx-auto mb-4" />
              <p className="text-nx-text font-bold text-lg mb-2">
                No events yet
              </p>
              <p className="text-nx-muted text-sm">Check back soon!</p>
            </GlassCard>
          </div>
        )}

        {upcoming.length > 0 && renderGrid(upcoming, "Upcoming Events")}
        {completed.length > 0 && renderGrid(completed, "Past Events")}
      </div>
    </main>
  )
}

function EventGridCard({ event }: { event: IEvent }) {
  const slug = event.slug || slugify(event.name)

  const statusColor =
    event.status === "Upcoming"
      ? { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.3)" }
      : { bg: "rgba(160,174,192,0.10)", text: "#A0AEC0", border: "rgba(160,174,192,0.2)" }

  return (
    <motion.div variants={cardVariants} className="h-full">
      <div
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden
                   bg-nx-surface/60 backdrop-blur-xl border border-nx-purple/25
                   hover:border-nx-orchid/50 hover:-translate-y-1
                   transition-all duration-300
                   hover:shadow-[0_8px_32px_rgba(170,39,229,0.15)]"
      >
        {/* Color strip */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: event.stripbg || "#AA27E5" }}
        />

        {/* Image */}
        {event.imageUrl && (
          <div className="relative h-44 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nx-surface/90 via-nx-surface/20 to-transparent" />
            {/* Status badge */}
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
              style={{
                backgroundColor: statusColor.bg,
                color: statusColor.text,
                borderColor: statusColor.border,
              }}
            >
              {event.status}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-nx-muted text-[10px] uppercase tracking-widest mb-2">
            <Calendar size={10} />
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>

          {/* Title */}
          <h3 className="text-nx-text font-outfit font-bold text-base leading-snug mb-2 line-clamp-2">
            {event.name}
          </h3>

          {/* Description */}
          <p className="text-nx-muted text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
            {event.description}
          </p>

          {/* Meta */}
          <div className="flex flex-col gap-1.5 mb-5">
            <span className="flex items-center gap-1.5 text-nx-muted text-[10px]">
              <Clock size={10} className="flex-shrink-0" />
              {event.time}
            </span>
            <span className="flex items-center gap-1.5 text-nx-muted text-[10px]">
              <MapPin size={10} className="flex-shrink-0" />
              {event.venue}, {event.place}
            </span>
            {event.organizedBy && (
              <span className="flex items-center gap-1.5 text-nx-muted text-[10px]">
                <Users size={10} className="flex-shrink-0" />
                {event.organizedBy}
              </span>
            )}
          </div>

          {/* Mode badge */}
          {event.mode && (
            <div className="mb-4">
              <span className="bg-nx-purple/20 text-nx-orchid text-[10px] px-2 py-0.5 rounded-full border border-nx-purple/30">
                {event.mode}
              </span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-2 mt-auto">
            <Link
              href={`/events/${slug}`}
              className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg
                         border border-nx-purple/35 text-nx-orchid
                         hover:bg-nx-orchid/10 hover:border-nx-orchid
                         transition-all duration-200"
            >
              View Details
            </Link>

            {event.status === "Upcoming" && (
              <>
                {event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg
                               bg-gradient-to-r from-nx-purple to-nx-orchid text-white
                               hover:opacity-90 transition-all duration-200"
                  >
                    Register →
                  </a>
                ) : (
                  <Link
                    href={`/register?eventId=${event._id}`}
                    className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg
                               bg-gradient-to-r from-nx-purple to-nx-orchid text-white
                               hover:opacity-90 transition-all duration-200"
                  >
                    Register →
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

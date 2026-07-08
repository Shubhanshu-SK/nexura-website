import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"
import SectionHeader from "@/components/ui/SectionHeader"
import GlassCard from "@/components/ui/GlassCard"
import RadialGlowButton from "@/components/ui/RadialGlowButton"
import { IEvent } from "@/types"

export default async function UpcomingEventsSection() {
  await dbConnect()
  const raw = await Event.find({ status: "Upcoming" })
    .sort({ date: 1 })
    .limit(3)
    .lean()
  const events: IEvent[] = JSON.parse(JSON.stringify(raw))

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header row with "View All" link */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <SectionHeader
            eyebrow="What's coming"
            title="Upcoming Events"
            centered={false}
          />
          <Link
            href="/events"
            className="flex items-center gap-2 text-nx-orchid text-sm
                       hover:gap-3 transition-all duration-200"
          >
            View all events <ArrowRight size={14} />
          </Link>
        </div>

        {/* Empty state */}
        {events.length === 0 && (
          <GlassCard className="p-12 text-center max-w-sm mx-auto">
            <Calendar size={40} className="text-nx-orchid mx-auto mb-3" />
            <p className="text-nx-text font-semibold mb-1">No upcoming events</p>
            <p className="text-nx-muted text-sm">Check back soon!</p>
          </GlassCard>
        )}

        {/* Events grid — max 3 cards */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div
                key={event._id}
                className="group relative rounded-2xl overflow-hidden
                           bg-nx-surface/60 backdrop-blur-xl
                           border border-nx-purple/25
                           hover:border-nx-orchid/50 hover:-translate-y-1
                           transition-all duration-300
                           hover:shadow-[0_8px_32px_rgba(170,39,229,0.12)]"
              >
                {/* Color strip */}
                <div
                  className="h-1 w-full"
                  style={{ background: event.stripbg || "#AA27E5" }}
                />

                <div className="p-5">
                  {/* Date */}
                  <div
                    className="flex items-center gap-2 text-nx-muted text-[10px]
                                uppercase tracking-widest mb-3"
                  >
                    <Calendar size={11} />
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-nx-text font-outfit font-bold text-lg
                               leading-tight mb-2 line-clamp-2"
                  >
                    {event.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-nx-muted text-xs leading-relaxed
                              line-clamp-2 mb-4"
                  >
                    {event.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <span className="flex items-center gap-1 text-nx-muted text-[10px]">
                      <Clock size={10} /> {event.time}
                    </span>
                    <span className="flex items-center gap-1 text-nx-muted text-[10px]">
                      <MapPin size={10} /> {event.venue}
                    </span>
                    <span
                      className="bg-nx-purple/20 text-nx-orchid text-[10px]
                                 px-2 py-0.5 rounded-full border border-nx-purple/30"
                    >
                      {(event as IEvent & { mode?: string }).mode || "Online"}
                    </span>
                  </div>

                  {/* CTA */}
                  {event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <RadialGlowButton size="sm" className="w-full">
                        Register →
                      </RadialGlowButton>
                    </a>
                  ) : (
                    <Link href={`/register?eventId=${event._id}`} className="block">
                      <RadialGlowButton size="sm" className="w-full">
                        Register →
                      </RadialGlowButton>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View all button (bottom) */}
        {events.length > 0 && (
          <div className="flex justify-center mt-10">
            <RadialGlowButton variant="ghost" size="md" href="/events">
              View All Events →
            </RadialGlowButton>
          </div>
        )}
      </div>
    </section>
  )
}

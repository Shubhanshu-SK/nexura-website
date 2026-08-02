import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import mongoose from "mongoose"
import { Calendar, MapPin, Clock, Users, ArrowLeft, Image as ImageIcon, BookOpen } from "lucide-react"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"
import SectionHeader from "@/components/ui/SectionHeader"
import GlassCard from "@/components/ui/GlassCard"
import RadialGlowButton from "@/components/ui/RadialGlowButton"
import AuroraBackground from "@/components/ui/AuroraBackground"
import { IEvent } from "@/types"

interface EventPageProps {
  params: Promise<{ slug: string }>
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function getEventBySlug(slug: string) {
  await dbConnect()
  
  // 1. Try finding by exact slug in db
  let event = await Event.findOne({ slug })
  if (event) return event

  // 2. If valid MongoDB ID, try finding by ID
  if (mongoose.isValidObjectId(slug)) {
    event = await Event.findById(slug)
    if (event) return event
  }

  // 3. Fallback: find all events, slugify their name, and match
  const allEvents = await Event.find({})
  for (const ev of allEvents) {
    if (slugify(ev.name) === slug) {
      return ev
    }
  }

  return null
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: "Event Not Found — Nexura" }
  return {
    title: `${event.name} — Nexura Club`,
    description: event.description,
  }
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params
  const eventDoc = await getEventBySlug(slug)
  if (!eventDoc) notFound()

  const event: IEvent & {
    speaker?: string
    host?: string
    domain?: string
    gallery?: string[]
  } = JSON.parse(JSON.stringify(eventDoc))

  // Fetch related events (upcoming, max 3, excluding current)
  const relatedRaw = await Event.find({
    _id: { $ne: event._id },
    status: "Upcoming",
  })
    .limit(3)
    .lean()
  const relatedEvents: IEvent[] = JSON.parse(JSON.stringify(relatedRaw))

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  })

  return (
    <main className="bg-nx-bg min-h-screen text-nx-text">
      {/* Aurora Banner Header */}
      <AuroraBackground className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-nx-orchid text-sm font-medium hover:underline mb-8"
          >
            <ArrowLeft size={16} /> Back to all events
          </Link>
          <div className="flex flex-col gap-4">
            <span className="bg-nx-purple/20 text-nx-orchid text-xs px-3 py-1 rounded-full border border-nx-purple/30 w-fit font-medium">
              {event.mode || "Online"} — {event.status}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-outfit text-nx-text leading-tight max-w-4xl">
              {event.name}
            </h1>
            <p className="text-nx-muted text-sm md:text-base max-w-2xl font-medium">
              Organized by {event.organizedBy}
            </p>
          </div>
        </div>
      </AuroraBackground>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Event Details */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Banner Image */}
            {event.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-nx-purple/20 shadow-2xl">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-nx-orchid text-[11px] uppercase tracking-[3px] font-medium mb-4">
                About the Event
              </h2>
              <div className="text-nx-text/95 leading-relaxed text-sm whitespace-pre-line font-medium">
                {event.description}
              </div>
            </div>

            {/* Speaker / Host Info */}
            {(event.speaker || event.host) && (
              <div>
                <h2 className="text-nx-orchid text-[11px] uppercase tracking-[3px] font-medium mb-4">
                  Guests &amp; Hosts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speaker && (
                    <GlassCard className="p-5">
                      <div className="flex items-center gap-3">
                        <Users className="text-nx-orchid" size={20} />
                        <div>
                          <p className="text-nx-muted text-[10px] uppercase tracking-wider">
                            Keynote Speaker
                          </p>
                          <p className="text-nx-text font-semibold text-sm">
                            {event.speaker}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  )}
                  {event.host && (
                    <GlassCard className="p-5">
                      <div className="flex items-center gap-3">
                        <Users className="text-nx-orchid" size={20} />
                        <div>
                          <p className="text-nx-muted text-[10px] uppercase tracking-wider">
                            Event Host / Mentor
                          </p>
                          <p className="text-nx-text font-semibold text-sm">
                            {event.host}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </div>
              </div>
            )}

            {/* Event Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <div>
                <h2 className="text-nx-orchid text-[11px] uppercase tracking-[3px] font-medium mb-4">
                  Event Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-square border border-nx-purple/15 hover:border-nx-orchid/50 transition-all duration-300 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`${event.name} gallery image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Side Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold font-outfit text-nx-text mb-5 pb-3 border-b border-nx-purple/15">
                  Event Info
                </h3>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-nx-orchid mt-0.5" size={18} />
                    <div>
                      <p className="text-nx-muted text-[10px] uppercase tracking-wider">
                        Date
                      </p>
                      <p className="text-nx-text text-sm font-semibold">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-nx-orchid mt-0.5" size={18} />
                    <div>
                      <p className="text-nx-muted text-[10px] uppercase tracking-wider">
                        Time
                      </p>
                      <p className="text-nx-text text-sm font-semibold">
                        {event.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-nx-orchid mt-0.5" size={18} />
                    <div>
                      <p className="text-nx-muted text-[10px] uppercase tracking-wider">
                        Venue &amp; Location
                      </p>
                      <p className="text-nx-text text-sm font-semibold">
                        {event.venue}, {event.place}
                      </p>
                    </div>
                  </div>

                  {event.domain && (
                    <div className="flex items-start gap-3">
                      <BookOpen className="text-nx-orchid mt-0.5" size={18} />
                      <div>
                        <p className="text-nx-muted text-[10px] uppercase tracking-wider">
                          Associated Domain
                        </p>
                        <p className="text-nx-text text-sm font-semibold">
                          {event.domain}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status and Action button */}
                <div className="flex flex-col gap-3">
                  <div className="text-center py-2 rounded-xl bg-nx-surface border border-nx-purple/20 text-xs font-semibold">
                    Status: <span className="text-nx-orchid">{event.status}</span>
                  </div>

                  {event.status === "Upcoming" && (
                    <>
                      {event.registrationLink ? (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center"
                        >
                          <RadialGlowButton size="lg" className="w-full">
                            Register Now →
                          </RadialGlowButton>
                        </a>
                      ) : (
                        <Link
                          href={`/register?eventId=${event._id}`}
                          className="block w-full text-center"
                        >
                          <RadialGlowButton size="lg" className="w-full">
                            Register Now →
                          </RadialGlowButton>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* RELATED EVENTS FOOTER SECTION */}
        {relatedEvents.length > 0 && (
          <div className="mt-20 pt-10 border-t border-nx-purple/15">
            <h2 className="text-nx-orchid text-[11px] uppercase tracking-[3px] font-medium mb-8 text-center">
              Other Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((related) => {
                const rSlug = related.slug || slugify(related.name)
                return (
                  <GlassCard key={related._id} className="p-5 flex flex-col justify-between h-full hover:border-nx-orchid/50 transition-all duration-300">
                    <div>
                      <div className="flex items-center gap-1.5 text-nx-muted text-[9px] uppercase tracking-wider mb-2">
                        <Calendar size={10} />
                        {new Date(related.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <h4 className="text-nx-text font-outfit font-bold text-sm leading-snug mb-2 line-clamp-2">
                        {related.name}
                      </h4>
                      <p className="text-nx-muted text-xs leading-relaxed line-clamp-2 mb-4">
                        {related.description}
                      </p>
                    </div>
                    <Link
                      href={`/events/${rSlug}`}
                      className="text-nx-orchid text-xs font-semibold hover:underline mt-auto flex items-center gap-1.5"
                    >
                      View Details →
                    </Link>
                  </GlassCard>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

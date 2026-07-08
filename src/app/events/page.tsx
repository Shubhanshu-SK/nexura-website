import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"
import EventsPageClient from "@/components/events/EventsPageClient"
import { IEvent } from "@/types"

export const metadata = {
  title: "Events — Nexura Club",
  description:
    "Explore upcoming workshops, competitions, and events organised by the Nexura Club at UIT-RGPV, Bhopal.",
}

export default async function EventsPage() {
  await dbConnect()
  const raw = await Event.find({}).sort({ date: -1 }).lean()
  const events: IEvent[] = JSON.parse(JSON.stringify(raw))
  return <EventsPageClient events={events} />
}

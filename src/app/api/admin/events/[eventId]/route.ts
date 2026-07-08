import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"
import Registration from "@/models/Registration"
import { withAdminAuth, AuthenticatedRequest } from "@/lib/withAdminAuth"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const eventUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  description: z.string().min(1, "Description cannot be empty").optional(),
  imageUrl: z.string().min(1, "Image URL cannot be empty").optional(),
  venue: z.string().min(1, "Venue cannot be empty").optional(),
  place: z.string().min(1, "Place cannot be empty").optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform((val) => new Date(val))
    .optional(),
  time: z.string().min(1, "Time cannot be empty").optional(),
  organizedBy: z.string().min(1, "Organized by cannot be empty").optional(),
  registrationLink: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
  status: z.enum(["Upcoming", "Completed"]).optional(),
  stripbg: z.string().optional(),
  mode: z.string().optional(),
  speaker: z.string().optional(),
  host: z.string().optional(),
  domain: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  slug: z.string().optional(),
})

export const GET = withAdminAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ eventId: string }> }
  ) => {
    try {
      await dbConnect()
      const { eventId } = await params
      const event = await Event.findById(eventId)
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      return NextResponse.json(event, { status: 200 })
    } catch (error) {
      console.error("[GET Event By ID Error]", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }
)

export const PUT = withAdminAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ eventId: string }> }
  ) => {
    try {
      await dbConnect()
      const { eventId } = await params
      const body = await req.json()

      const parseResult = eventUpdateSchema.safeParse(body)
      if (!parseResult.success) {
        return NextResponse.json(
          { error: parseResult.error.issues },
          { status: 400 }
        )
      }

      const updateData = parseResult.data

      // If name is updated, but slug is not explicitly updated, or if slug is empty, regenerate slug
      if (updateData.name && (!updateData.slug || updateData.slug.trim() === "")) {
        updateData.slug = slugify(updateData.name)
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true, runValidators: true }
      )

      if (!updatedEvent) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      return NextResponse.json(updatedEvent, { status: 200 })
    } catch (error) {
      console.error("[PUT Event Error]", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }
)

export const DELETE = withAdminAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ eventId: string }> }
  ) => {
    try {
      await dbConnect()
      const { eventId } = await params

      const event = await Event.findById(eventId)
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      await Promise.all([
        Event.findByIdAndDelete(eventId),
        Registration.deleteMany({ eventId }),
      ])

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      console.error("[DELETE Event Error]", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }
)

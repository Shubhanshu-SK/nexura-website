import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"
import { withAdminAuth, AuthenticatedRequest } from "@/lib/withAdminAuth"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const eventCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  venue: z.string().min(1, "Venue is required"),
  place: z.string().min(1, "Place is required"),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  time: z.string().min(1, "Time is required"),
  organizedBy: z.string().min(1, "Organized by is required"),
  registrationLink: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
  status: z.enum(["Upcoming", "Completed"]).optional().default("Upcoming"),
  stripbg: z.string().optional(),
  mode: z.string().optional(),
  speaker: z.string().optional().default(""),
  host: z.string().optional().default(""),
  domain: z.string().optional().default(""),
  gallery: z.array(z.string()).optional().default([]),
  slug: z.string().optional(),
})

export const GET = withAdminAuth(async (req: AuthenticatedRequest) => {
  try {
    await dbConnect()
    const events = await Event.find({}).sort({ date: 1 })
    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error("[GET Admin Events Error]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
})

export const POST = withAdminAuth(async (req: AuthenticatedRequest) => {
  try {
    await dbConnect()
    const body = await req.json()

    const parseResult = eventCreateSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues },
        { status: 400 }
      )
    }

    const eventData = parseResult.data
    const slug = eventData.slug || slugify(eventData.name)

    const newEvent = await Event.create({
      ...eventData,
      slug,
      registrationLink: eventData.registrationLink || null,
    })

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("[POST Admin Events Error]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
})

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"
import Registration from "@/models/Registration"
import { sendConfirmationEmail } from "@/lib/mailer"

const SOIT_BRANCHES = ["AI/ML", "CS/BS", "CS/DS"]
const UIT_BRANCHES = [
  "Automobile Engineering",
  "Computer Science",
  "Mechanical Engineering",
  "Electronics & Communication",
  "Civil Engineering",
  "Other",
]
const ALL_BRANCHES = [...UIT_BRANCHES, ...SOIT_BRANCHES]

const registerSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  institute: z.enum(["UIT", "SOIT"], { message: "Invalid institute" }),
  branch: z.string().refine((b) => ALL_BRANCHES.includes(b), {
    message: "Invalid branch",
  }),
  year: z.string().min(1, "Year is required"),
  enrollmentNo: z.string().min(1, "Enrollment number is required"),
})

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()

    const parseResult = registerSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues },
        { status: 400 }
      )
    }

    const { eventId, name, email, phone, institute, branch, year, enrollmentNo } =
      parseResult.data

    // Validate institute ↔ branch consistency
    if (institute === "SOIT" && !SOIT_BRANCHES.includes(branch)) {
      return NextResponse.json(
        { error: "Branch not available for SOIT" },
        { status: 400 }
      )
    }
    if (institute === "UIT" && !UIT_BRANCHES.includes(branch)) {
      return NextResponse.json(
        { error: "Branch not available for UIT" },
        { status: 400 }
      )
    }

    // Verify event exists and is Upcoming
    const event = await Event.findById(eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    if (event.status !== "Upcoming") {
      return NextResponse.json(
        { error: "Event is no longer accepting registrations" },
        { status: 400 }
      )
    }

    // If event has external registration link, block native registration
    if (event.registrationLink) {
      return NextResponse.json(
        { error: "Use external registration link" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedEnrollment = enrollmentNo.toUpperCase().trim()

    let registration
    try {
      registration = await Registration.create({
        eventId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        institute,
        branch: branch.trim(),
        year: year.trim(),
        enrollmentNo: normalizedEnrollment,
      })
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          { error: "Already registered for this event" },
          { status: 409 }
        )
      }
      throw err
    }

    // Send confirmation email — non-blocking
    sendConfirmationEmail({
      to: normalizedEmail,
      participantName: name.trim(),
      eventName: event.name,
      eventDate: event.date.toString(),
      eventVenue: `${event.venue}, ${event.place}`,
    }).catch(console.error)

    return NextResponse.json(
      { success: true, registrationId: registration._id.toString() },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Registration Error]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

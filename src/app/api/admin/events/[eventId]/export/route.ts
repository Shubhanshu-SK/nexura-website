import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/dbConnect"
import Registration from "@/models/Registration"
import Event from "@/models/Event"
import { withAdminAuth, AuthenticatedRequest } from "@/lib/withAdminAuth"

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

      const registrations = await Registration.find({ eventId }).sort({
        createdAt: -1,
      })

      // Build CSV
      const headers = [
        "Name",
        "Email",
        "Phone",
        "Institute",
        "Branch",
        "Year",
        "Enrollment No",
        "Event Name",
        "Registration Time",
      ]

      const rows = registrations.map((r: any) => [
        r.name,
        r.email,
        r.phone,
        r.institute || "UIT",
        r.branch,
        r.year,
        r.enrollmentNo,
        event.name,
        r.createdAt
          ? new Date(r.createdAt).toLocaleString("en-IN")
          : "",
      ])

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n")

      const safeEventName = event.name.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/ /g, "_")
      const filename = `${safeEventName}_Registrations.csv`

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    } catch (error) {
      console.error("[CSV Export Error]", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }
)

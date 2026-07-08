import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/dbConnect"
import Registration from "@/models/Registration"
import { withAdminAuth, AuthenticatedRequest } from "@/lib/withAdminAuth"

export const GET = withAdminAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ eventId: string }> }
  ) => {
    try {
      await dbConnect()
      const { eventId } = await params
      const { searchParams } = new URL(req.url)
      const search = searchParams.get("search")?.trim()

      const query: Record<string, any> = { eventId }
      if (search) {
        query.name = { $regex: search, $options: "i" }
      }

      const registrations = await Registration.find(query).sort({ createdAt: -1 })
      return NextResponse.json(registrations, { status: 200 })
    } catch (error) {
      console.error("[GET Registrations Error]", error)
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
      const result = await Registration.deleteMany({ eventId })
      return NextResponse.json({ deleted: result.deletedCount }, { status: 200 })
    } catch (error) {
      console.error("[DELETE All Registrations Error]", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }
)

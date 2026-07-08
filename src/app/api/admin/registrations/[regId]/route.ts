import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/dbConnect"
import Registration from "@/models/Registration"
import { withAdminAuth, AuthenticatedRequest } from "@/lib/withAdminAuth"

export const DELETE = withAdminAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ regId: string }> }
  ) => {
    try {
      await dbConnect()
      const { regId } = await params
      const deleted = await Registration.findByIdAndDelete(regId)
      if (!deleted) {
        return NextResponse.json(
          { error: "Registration not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      console.error("[DELETE Registration Error]", error)
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  }
)

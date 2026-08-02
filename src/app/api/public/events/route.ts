import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const events = await Event.find({ status: "Upcoming" })
      .sort({ date: 1 })
      .select("-__v")
    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error("[Public Events Error]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

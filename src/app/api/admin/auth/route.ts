import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/dbConnect"
import Admin from "@/models/Admin"
import { signToken } from "@/lib/jwt"

const authSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()

    const parseResult = authSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues },
        { status: 400 }
      )
    }

    const { username, password } = parseResult.data

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({ adminId: admin._id.toString(), username: admin.username })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error("[Admin Auth Error]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

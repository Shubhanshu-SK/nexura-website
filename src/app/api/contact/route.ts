import { NextRequest, NextResponse } from "next/server"
import { sendContactNotification } from "@/lib/mailer"
import { z } from "zod"

const schema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  message: z.string().min(1).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    console.log("[Contact]", body.name, body.email)

    // Non-blocking — contact form success should not depend on email success
    sendContactNotification({
      senderName: body.name,
      senderEmail: body.email,
      message: body.message,
    }).catch(err => console.error("[Contact email failed]", err))

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

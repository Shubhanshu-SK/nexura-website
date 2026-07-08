import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log("[Contact Form]", body)
  return NextResponse.json({ success: true })
}

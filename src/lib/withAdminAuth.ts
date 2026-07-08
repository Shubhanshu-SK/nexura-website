import { NextRequest, NextResponse } from "next/server"
import { verifyToken, JWTPayload } from "./jwt"

export interface AuthenticatedRequest extends NextRequest {
  admin?: JWTPayload
}

export function withAdminAuth<T = any>(
  handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse> | Promise<Response>
) {
  return async (req: AuthenticatedRequest, context: T) => {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      )
    }

    req.admin = decoded
    return handler(req, context)
  }
}

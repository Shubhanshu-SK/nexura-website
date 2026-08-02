import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_nexura_secret_key"

export interface JWTPayload {
  adminId: string
  username: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

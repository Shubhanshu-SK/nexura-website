"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok && data.token) {
        // Set httpOnly-like cookie for middleware
        document.cookie = `nexura_admin_token=${data.token}; max-age=28800; path=/; SameSite=Strict`
        // Also store in localStorage for client-side fetch calls
        localStorage.setItem("nexura_admin_token", data.token)
        router.push("/admin/events")
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#08050e",
    border: "1px solid rgba(139, 34, 184, 0.3)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#F5F4FA",
    fontSize: 14,
    outline: "none",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#A0AEC0",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 6,
    fontFamily: "Inter, sans-serif",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#08050e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          backgroundColor: "#0f0a1d",
          border: "1px solid rgba(139, 34, 184, 0.25)",
          borderRadius: 16,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "Outfit, Inter, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.15em",
              color: "#AA27E5",
              marginBottom: 6,
            }}
          >
            NEXURA
          </div>
          <div
            style={{
              color: "#A0AEC0",
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Admin Panel Login
          </div>
        </div>

        {/* Username */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              color: "#FF7F50",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #8B22B8, #AA27E5)",
            color: "#F5F4FA",
            border: "none",
            borderRadius: 10,
            padding: "13px 0",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Outfit, Inter, sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            letterSpacing: "0.05em",
          }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  )
}

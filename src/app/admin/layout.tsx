"use client"

import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear cookie
    document.cookie = "nexura_admin_token=; max-age=0; path=/"
    // Clear localStorage
    localStorage.removeItem("nexura_admin_token")
    router.push("/admin/login")
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08050e", color: "#F5F4FA" }}>
      {/* Top header bar */}
      <header
        style={{
          height: 56,
          backgroundColor: "#0f0a1d",
          borderBottom: "1px solid rgba(139, 34, 184, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "Outfit, Inter, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.15em",
            color: "#AA27E5",
          }}
        >
          NEXURA ADMIN
        </span>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            border: "1px solid rgba(139, 34, 184, 0.4)",
            color: "#A0AEC0",
            padding: "6px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLButtonElement).style.borderColor = "#AA27E5"
            ;(e.target as HTMLButtonElement).style.color = "#F5F4FA"
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.borderColor = "rgba(139, 34, 184, 0.4)"
            ;(e.target as HTMLButtonElement).style.color = "#A0AEC0"
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  )
}

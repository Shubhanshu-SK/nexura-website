"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"

interface IRegistration {
  _id: string
  name: string
  email: string
  phone: string
  institute?: string
  branch: string
  year: string
  enrollmentNo: string
  createdAt: string
}

function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("nexura_admin_token")
    : null
}

export default function RegistrationsPage() {
  const router = useRouter()
  const params = useParams<{ eventId: string }>()
  const eventId = params?.eventId

  const [registrations, setRegistrations] = useState<IRegistration[]>([])
  const [eventName, setEventName] = useState("")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDeleteAll, setShowDeleteAll] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchRegistrations = useCallback(
    async (q?: string) => {
      if (!eventId) return
      const token = getToken()
      if (!token) {
        router.push("/admin/login")
        return
      }
      setErrorMsg("")
      try {
        const url = q
          ? `/api/admin/events/${eventId}/registrations?search=${encodeURIComponent(q)}`
          : `/api/admin/events/${eventId}/registrations`
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          router.push("/admin/login")
          return
        }
        if (!res.ok) {
          throw new Error("Failed to fetch registrations")
        }
        const data = await res.json()
        setRegistrations(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setErrorMsg(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    },
    [eventId, router]
  )

  // Fetch event name
  useEffect(() => {
    if (!eventId) return
    const token = getToken()
    fetch(`/api/admin/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setEventName(d.name || ""))
      .catch(() => {})
  }, [eventId])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  // Debounced search
  const handleSearchChange = (val: string) => {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchRegistrations(val)
    }, 300)
  }

  const handleDeleteOne = async (regId: string) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return
    setDeleting(regId)
    try {
      const token = getToken()
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        alert("Registration deleted successfully!")
        setRegistrations((prev) => prev.filter((r) => r._id !== regId))
      } else {
        alert("Failed to delete registration")
      }
    } catch {
      alert("Network error")
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteAll = async () => {
    setDeletingAll(true)
    try {
      const token = getToken()
      const res = await fetch(`/api/admin/events/${eventId}/registrations`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        alert("All registrations deleted successfully!")
        setRegistrations([])
        setShowDeleteAll(false)
      } else {
        alert("Failed to delete registrations")
      }
    } catch {
      alert("Network error")
    } finally {
      setDeletingAll(false)
    }
  }

  const handleDownloadCSV = async () => {
    const token = getToken()
    try {
      const res = await fetch(`/api/admin/events/${eventId}/export`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        alert("Failed to download CSV")
        return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const disposition = res.headers.get("content-disposition")
      let filename = `${eventName.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/ /g, "_") || "Event"}_Registrations.csv`
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(disposition)
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "")
        }
      }
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch {
      alert("Error downloading CSV")
    }
  }

  const thStyle: React.CSSProperties = {
    color: "#A0AEC0",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    padding: "10px 14px",
    textAlign: "left",
    borderBottom: "1px solid rgba(139, 34, 184, 0.15)",
    whiteSpace: "nowrap",
  }
  const tdStyle: React.CSSProperties = {
    color: "#F5F4FA",
    fontSize: 13,
    fontFamily: "Inter, sans-serif",
    padding: "10px 14px",
    borderBottom: "1px solid rgba(139, 34, 184, 0.08)",
  }

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => router.push("/admin/events")}
          style={{
            background: "none",
            border: "none",
            color: "#AA27E5",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            padding: 0,
            marginBottom: 6,
          }}
        >
          ← Events
        </button>
        <h1
          style={{
            color: "#F5F4FA",
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            fontFamily: "Outfit, Inter, sans-serif",
          }}
        >
          {eventName || "Registrations"}
        </h1>
        <div
          style={{
            color: "#A0AEC0",
            fontSize: 13,
            marginTop: 4,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {registrations.length} total registration
          {registrations.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name…"
          style={{
            flex: 1,
            minWidth: 220,
            backgroundColor: "#0f0a1d",
            border: "1px solid rgba(139, 34, 184, 0.3)",
            borderRadius: 8,
            padding: "9px 14px",
            color: "#F5F4FA",
            fontSize: 13,
            outline: "none",
            fontFamily: "Inter, sans-serif",
          }}
        />
        {registrations.length > 0 && (
          <>
            <button
              onClick={handleDownloadCSV}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(170, 39, 229, 0.4)",
                color: "#AA27E5",
                padding: "9px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = "rgba(170, 39, 229, 0.1)"
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = "transparent"
              }}
            >
              Download CSV
            </button>
            <button
              onClick={() => setShowDeleteAll(true)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 127, 80, 0.4)",
                color: "#FF7F50",
                padding: "9px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = "rgba(255, 127, 80, 0.1)"
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.backgroundColor = "transparent"
              }}
            >
              Delete All
            </button>
          </>
        )}
      </div>

      {/* Error State */}
      {errorMsg && (
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "rgba(255, 127, 80, 0.1)",
            border: "1px solid rgba(255, 127, 80, 0.3)",
            borderRadius: 8,
            color: "#FF7F50",
            marginBottom: 20,
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#A0AEC0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Loading registrations…
        </div>
      )}

      {/* Empty */}
      {!loading && registrations.length === 0 && !errorMsg && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#A0AEC0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          No registrations found for this event.
        </div>
      )}

      {/* Table */}
      {!loading && registrations.length > 0 && (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 12,
            border: "1px solid rgba(139, 34, 184, 0.2)",
            backgroundColor: "#0f0a1d",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Institute</th>
                <th style={thStyle}>Branch</th>
                <th style={thStyle}>Year</th>
                <th style={thStyle}>Enrollment No</th>
                <th style={thStyle}>Registered At</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id}>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={{ ...tdStyle, color: "#A0AEC0" }}>{r.email}</td>
                  <td style={{ ...tdStyle, color: "#A0AEC0" }}>{r.phone}</td>
                  <td style={{ ...tdStyle, color: "#AA27E5", fontWeight: 600 }}>
                    {r.institute || "UIT"}
                  </td>
                  <td style={{ ...tdStyle, color: "#A0AEC0" }}>{r.branch}</td>
                  <td style={{ ...tdStyle, color: "#A0AEC0" }}>{r.year}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {r.enrollmentNo}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: "#A0AEC0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteOne(r._id)}
                      disabled={deleting === r._id}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgba(255,127,80,0.35)",
                        color: "#FF7F50",
                        padding: "4px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                        opacity: deleting === r._id ? 0.5 : 1,
                      }}
                    >
                      {deleting === r._id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete All Confirm Dialog */}
      {showDeleteAll && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowDeleteAll(false)}
        >
          <div
            style={{
              backgroundColor: "#0f0a1d",
              border: "1px solid rgba(255,127,80,0.4)",
              borderRadius: 14,
              padding: "28px 24px",
              maxWidth: 380,
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                color: "#FF7F50",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 10,
                fontFamily: "Outfit, Inter, sans-serif",
              }}
            >
              Delete All Registrations?
            </div>
            <div
              style={{
                color: "#A0AEC0",
                fontSize: 13,
                marginBottom: 24,
                lineHeight: 1.6,
                fontFamily: "Inter, sans-serif",
              }}
            >
              This will permanently remove all {registrations.length}{" "}
              registration{registrations.length !== 1 ? "s" : ""} for this event.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteAll(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(160,174,192,0.3)",
                  color: "#A0AEC0",
                  padding: "9px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                style={{
                  backgroundColor: "#c0392b",
                  color: "#fff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Outfit, Inter, sans-serif",
                  opacity: deletingAll ? 0.6 : 1,
                }}
              >
                {deletingAll ? "Deleting…" : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

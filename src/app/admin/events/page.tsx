"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface IEvent {
  _id: string
  name: string
  description: string
  imageUrl: string
  venue: string
  place: string
  date: string
  time: string
  organizedBy: string
  registrationLink?: string | null
  status: "Upcoming" | "Completed"
  stripbg?: string
  mode?: string
  speaker?: string
  host?: string
  domain?: string
  gallery?: string[]
  slug?: string
}

interface EventFormData {
  name: string
  description: string
  imageUrl: string
  venue: string
  place: string
  date: string
  time: string
  organizedBy: string
  registrationLink: string
  status: "Upcoming" | "Completed"
  stripbg: string
  mode: string
  speaker: string
  host: string
  domain: string
  gallery: string
  slug: string
}

const emptyForm: EventFormData = {
  name: "",
  description: "",
  imageUrl: "",
  venue: "",
  place: "",
  date: "",
  time: "",
  organizedBy: "",
  registrationLink: "",
  status: "Upcoming",
  stripbg: "#AA27E5",
  mode: "Online",
  speaker: "",
  host: "",
  domain: "",
  gallery: "",
  slug: "",
}

function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("nexura_admin_token")
    : null
}

// ─── Event Form Modal ──────────────────────────────────────────────────────
function EventModal({
  event,
  onClose,
  onSave,
}: {
  event: IEvent | null
  onClose: () => void
  onSave: () => void
}) {
  const [form, setForm] = useState<EventFormData>(
    event
      ? {
          name: event.name,
          description: event.description,
          imageUrl: event.imageUrl,
          venue: event.venue,
          place: event.place,
          date: event.date.split("T")[0],
          time: event.time,
          organizedBy: event.organizedBy,
          registrationLink: event.registrationLink || "",
          status: event.status,
          stripbg: event.stripbg || "#AA27E5",
          mode: event.mode || "Online",
          speaker: event.speaker || "",
          host: event.host || "",
          domain: event.domain || "",
          gallery: event.gallery ? event.gallery.join(", ") : "",
          slug: event.slug || "",
        }
      : emptyForm
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const token = getToken()
      const url = event
        ? `/api/admin/events/${event._id}`
        : "/api/admin/events"
      const method = event ? "PUT" : "POST"

      const galleryArray = form.gallery
        ? form.gallery
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url !== "")
        : []

      const payload = {
        ...form,
        registrationLink: form.registrationLink || null,
        gallery: galleryArray,
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        alert(event ? "Event updated successfully!" : "Event created successfully!")
        onSave()
        onClose()
      } else {
        const data = await res.json()
        setError(
          Array.isArray(data.error)
            ? data.error.map((e: any) => e.message).join(", ")
            : data.error || "Save failed"
        )
      }
    } catch {
      setError("Network error")
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#08050e",
    border: "1px solid rgba(139, 34, 184, 0.3)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#F5F4FA",
    fontSize: 13,
    outline: "none",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
  }
  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#A0AEC0",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 5,
    fontFamily: "Inter, sans-serif",
  }
  const fieldStyle: React.CSSProperties = { marginBottom: 14 }

  const gridTwo: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#0f0a1d",
          border: "1px solid rgba(139, 34, 184, 0.3)",
          borderRadius: 16,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 560,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#A0AEC0",
            fontSize: 20,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              color: "#AA27E5",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 4,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {event ? "Edit Event" : "New Event"}
          </div>
          <div
            style={{
              color: "#F5F4FA",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Outfit, Inter, sans-serif",
            }}
          >
            {event ? event.name : "Create Event"}
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Event Name *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Event name" />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Description *</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Event description"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Image URL *</label>
          <input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." />
        </div>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Venue *</label>
            <input style={inputStyle} value={form.venue} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} placeholder="Hall / Lab" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Place *</label>
            <input style={inputStyle} value={form.place} onChange={(e) => setForm((p) => ({ ...p, place: e.target.value }))} placeholder="On-campus / Virtual" />
          </div>
        </div>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Date *</label>
            <input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Time *</label>
            <input style={inputStyle} value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} placeholder="10:00 AM - 1:00 PM" />
          </div>
        </div>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Organized By *</label>
            <input style={inputStyle} value={form.organizedBy} onChange={(e) => setForm((p) => ({ ...p, organizedBy: e.target.value }))} placeholder="Team / Dept" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Mode</label>
            <select style={inputStyle} value={form.mode} onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Speaker</label>
            <input style={inputStyle} value={form.speaker} onChange={(e) => setForm((p) => ({ ...p, speaker: e.target.value }))} placeholder="Keynote Speaker Name" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Host</label>
            <input style={inputStyle} value={form.host} onChange={(e) => setForm((p) => ({ ...p, host: e.target.value }))} placeholder="Event Host Name" />
          </div>
        </div>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Domain</label>
            <input style={inputStyle} value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))} placeholder="e.g. Web Dev" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Slug (optional)</label>
            <input style={inputStyle} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="e.g. web-dev-camp" />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Gallery Image URLs (comma-separated)</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical", minHeight: 60 }}
            value={form.gallery}
            onChange={(e) => setForm((p) => ({ ...p, gallery: e.target.value }))}
            placeholder="https://image1.jpg, https://image2.jpg"
          />
        </div>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Upcoming" | "Completed" }))}>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Strip Color</label>
            <input style={inputStyle} value={form.stripbg} onChange={(e) => setForm((p) => ({ ...p, stripbg: e.target.value }))} placeholder="#AA27E5" />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Registration Link (optional — leave blank for native form)</label>
          <input style={inputStyle} value={form.registrationLink} onChange={(e) => setForm((p) => ({ ...p, registrationLink: e.target.value }))} placeholder="https://forms.gle/... or leave blank" />
        </div>

        {error && (
          <div style={{ color: "#FF7F50", fontSize: 13, marginBottom: 14, fontFamily: "Inter, sans-serif" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
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
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : event ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────
function DeleteConfirmModal({
  event,
  onClose,
  onDeleted,
}: {
  event: IEvent
  onClose: () => void
  onDeleted: () => void
}) {
  const [confirmName, setConfirmName] = useState("")
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmName !== event.name) return
    setDeleting(true)
    try {
      const token = getToken()
      const res = await fetch(`/api/admin/events/${event._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        alert("Event deleted successfully!")
        onDeleted()
        onClose()
      } else {
        alert("Delete failed")
      }
    } catch {
      alert("Network error")
    } finally {
      setDeleting(false)
    }
  }

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#0f0a1d",
          border: "1px solid rgba(255,127,80,0.4)",
          borderRadius: 16,
          padding: "28px 24px",
          maxWidth: 420,
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: "#FF7F50", fontWeight: 700, fontSize: 16, marginBottom: 10, fontFamily: "Outfit, Inter, sans-serif" }}>
          Delete Event
        </div>
        <div style={{ color: "#A0AEC0", fontSize: 13, marginBottom: 20, lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
          This will permanently delete <strong style={{ color: "#F5F4FA" }}>{event.name}</strong> and all its registrations. Type the event name to confirm:
        </div>
        <input
          style={{
            width: "100%",
            backgroundColor: "#08050e",
            border: "1px solid rgba(255,127,80,0.4)",
            borderRadius: 8,
            padding: "10px 12px",
            color: "#F5F4FA",
            fontSize: 13,
            outline: "none",
            fontFamily: "Inter, sans-serif",
            boxSizing: "border-box",
            marginBottom: 16,
          }}
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
          placeholder={event.name}
        />
        <button
          onClick={handleDelete}
          disabled={confirmName !== event.name || deleting}
          style={{
            width: "100%",
            backgroundColor: confirmName === event.name ? "#c0392b" : "rgba(255,127,80,0.15)",
            color: confirmName === event.name ? "#fff" : "#FF7F50",
            border: "none",
            borderRadius: 8,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 600,
            cursor: confirmName === event.name && !deleting ? "pointer" : "not-allowed",
            fontFamily: "Outfit, Inter, sans-serif",
          }}
        >
          {deleting ? "Deleting…" : "Delete Event"}
        </button>
      </div>
    </div>
  )
}

// ─── Main Events Page ──────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<IEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editEvent, setEditEvent] = useState<IEvent | null>(null)
  const [deleteEvent, setDeleteEvent] = useState<IEvent | null>(null)

  const fetchEvents = useCallback(async () => {
    const token = getToken()
    if (!token) { router.push("/admin/login"); return }
    try {
      const res = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { router.push("/admin/login"); return }
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const badgeStyle = (status: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    backgroundColor: status === "Upcoming" ? "rgba(52, 211, 153, 0.15)" : "rgba(160, 174, 192, 0.15)",
    color: status === "Upcoming" ? "#34d399" : "#A0AEC0",
    border: `1px solid ${status === "Upcoming" ? "rgba(52, 211, 153, 0.3)" : "rgba(160, 174, 192, 0.2)"}`,
  })

  const actionBtnStyle = (color: string): React.CSSProperties => ({
    backgroundColor: "transparent",
    border: `1px solid ${color}40`,
    color,
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
  })

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80, color: "#A0AEC0", fontFamily: "Inter, sans-serif" }}>
        Loading events…
      </div>
    )
  }

  return (
    <>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <div style={{ color: "#AA27E5", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4, fontFamily: "Inter, sans-serif" }}>
            Management
          </div>
          <h1 style={{ color: "#F5F4FA", fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "Outfit, Inter, sans-serif" }}>
            Events
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "linear-gradient(135deg, #8B22B8, #AA27E5)",
            color: "#F5F4FA",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Outfit, Inter, sans-serif",
          }}
        >
          + Add Event
        </button>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#A0AEC0", fontFamily: "Inter, sans-serif" }}>
          No events yet. Click &quot;+ Add Event&quot; to create the first one.
        </div>
      )}

      {/* Events grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {events.map((ev) => (
          <div
            key={ev._id}
            style={{
              backgroundColor: "#0f0a1d",
              border: "1px solid rgba(139, 34, 184, 0.2)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {/* Color strip */}
            <div style={{ height: 4, backgroundColor: ev.stripbg || "#AA27E5" }} />

            {/* Image */}
            {ev.imageUrl && (
              <img
                src={ev.imageUrl}
                alt={ev.name}
                style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
              />
            )}

            {/* Content */}
            <div style={{ padding: "16px 16px 12px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <div style={{ color: "#F5F4FA", fontWeight: 700, fontSize: 14, fontFamily: "Outfit, Inter, sans-serif", lineHeight: 1.3, flex: 1 }}>
                  {ev.name}
                </div>
                <span style={badgeStyle(ev.status)}>{ev.status}</span>
              </div>
              <div style={{ color: "#A0AEC0", fontSize: 12, marginBottom: 4, fontFamily: "Inter, sans-serif" }}>
                📅 {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div style={{ color: "#A0AEC0", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                📍 {ev.venue}, {ev.place}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                style={actionBtnStyle("#AA27E5")}
                onClick={() => router.push(`/admin/events/${ev._id}/registrations`)}
              >
                Registrations
              </button>
              <button style={actionBtnStyle("#A0AEC0")} onClick={() => setEditEvent(ev)}>
                Edit
              </button>
              <button style={actionBtnStyle("#FF7F50")} onClick={() => setDeleteEvent(ev)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {(showAddModal || editEvent) && (
        <EventModal
          event={editEvent}
          onClose={() => { setShowAddModal(false); setEditEvent(null) }}
          onSave={fetchEvents}
        />
      )}
      {deleteEvent && (
        <DeleteConfirmModal
          event={deleteEvent}
          onClose={() => setDeleteEvent(null)}
          onDeleted={fetchEvents}
        />
      )}
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import AuroraBackground from "@/components/ui/AuroraBackground"
import SectionHeader from "@/components/ui/SectionHeader"
import RadialGlowButton from "@/components/ui/RadialGlowButton"
import { IEvent } from "@/types"

const UIT_BRANCHES = [
  "Automobile Engineering",
  "Computer Science",
  "Mechanical Engineering",
  "Electronics & Communication",
  "Civil Engineering",
  "Other",
]

const SOIT_BRANCHES = [
  "AI/ML",
  "CS/BS",
  "CS/DS",
]

export default function RegisterPage() {
  const [events, setEvents] = useState<IEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [fields, setFields] = useState({
    eventId: "",
    name: "",
    email: "",
    phone: "",
    institute: "UIT",
    branch: "",
    year: "",
    enrollmentNo: "",
  })
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "duplicate" | "error"
  >("idle")

  useEffect(() => {
    // Pre-select event from URL
    const searchParams = new URLSearchParams(window.location.search)
    const preselect = searchParams.get("eventId")
    if (preselect) setFields((p) => ({ ...p, eventId: preselect }))

    // Load upcoming events for dropdown
    fetch("/api/public/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : [])
        setLoadingEvents(false)
      })
      .catch(() => setLoadingEvents(false))
  }, [])

  const handleSubmit = async () => {
    if (
      !fields.eventId ||
      !fields.name ||
      !fields.email ||
      !fields.phone ||
      !fields.institute ||
      !fields.branch ||
      !fields.year ||
      !fields.enrollmentNo
    ) {
      alert("Please fill in all fields")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })
      if (res.status === 201) setStatus("success")
      else if (res.status === 409) setStatus("duplicate")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  const inputClass =
    "w-full bg-nx-bg/80 border border-nx-purple/25 rounded-xl px-4 py-3 text-nx-text text-sm focus:border-nx-orchid outline-none transition-colors duration-200 backdrop-blur-sm"
  const labelClass =
    "block text-nx-muted text-[11px] uppercase tracking-wider mb-1.5"

  const activeBranches = fields.institute === "SOIT" ? SOIT_BRANCHES : UIT_BRANCHES

  return (
    <AuroraBackground className="min-h-screen">
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <SectionHeader
              eyebrow="Join the experience"
              title="Event Registration"
              subtitle="Fill in your details to secure your spot"
              centered
            />
          </div>

          {/* Card */}
          <div
            className="bg-nx-surface/70 backdrop-blur-xl border border-nx-purple/25
                        rounded-2xl p-8 shadow-[0_8px_40px_rgba(139,34,184,0.12)]"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* ── SUCCESS STATE ─────────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle2
                    size={56}
                    className="text-nx-orchid mx-auto mb-4"
                  />
                  <h2 className="text-nx-text font-outfit font-bold text-2xl mb-2">
                    You&apos;re registered!
                  </h2>
                  <p className="text-nx-muted text-sm mb-2">
                    Confirmation email sent to{" "}
                    <span className="text-nx-orchid">{fields.email}</span>
                  </p>
                  <p className="text-nx-muted text-xs mb-8">
                    Check your inbox (and spam folder) for event details.
                  </p>
                  <RadialGlowButton
                    variant="ghost"
                    size="md"
                    href="/events"
                  >
                    Browse More Events →
                  </RadialGlowButton>
                </motion.div>
              ) : (
                /* ── FORM STATE ────────────────────────────── */
                <motion.div key="form">
                  {/* Event selector */}
                  <div className="mb-5">
                    <label className={labelClass}>Select Event *</label>
                    {loadingEvents ? (
                      <div
                        className="w-full h-12 bg-nx-bg/80 border border-nx-purple/25
                                    rounded-xl animate-pulse"
                      />
                    ) : (
                      <select
                        className={inputClass}
                        value={fields.eventId}
                        onChange={(e) =>
                          setFields((p) => ({ ...p, eventId: e.target.value }))
                        }
                      >
                        <option value="">Choose an event...</option>
                        {events.map((ev) => (
                          <option key={ev._id} value={ev._id}>
                            {ev.name} —{" "}
                            {new Date(ev.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-nx-purple/15 my-6" />

                  {/* Personal details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        className={inputClass}
                        value={fields.name}
                        onChange={(e) =>
                          setFields((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          className={inputClass}
                          value={fields.email}
                          onChange={(e) =>
                            setFields((p) => ({ ...p, email: e.target.value }))
                          }
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Phone *</label>
                        <input
                          type="tel"
                          className={inputClass}
                          value={fields.phone}
                          onChange={(e) =>
                            setFields((p) => ({ ...p, phone: e.target.value }))
                          }
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className={labelClass}>Institute *</label>
                        <select
                          className={inputClass}
                          value={fields.institute}
                          onChange={(e) => {
                            const inst = e.target.value
                            setFields((p) => ({
                              ...p,
                              institute: inst,
                              branch: "", // Reset branch on institute change
                            }))
                          }}
                        >
                          <option value="UIT">UIT</option>
                          <option value="SOIT">SOIT</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Branch *</label>
                        <select
                          className={inputClass}
                          value={fields.branch}
                          onChange={(e) =>
                            setFields((p) => ({
                              ...p,
                              branch: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select branch</option>
                          {activeBranches.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Year *</label>
                        <select
                          className={inputClass}
                          value={fields.year}
                          onChange={(e) =>
                            setFields((p) => ({ ...p, year: e.target.value }))
                          }
                        >
                          <option value="">Select year</option>
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Enrollment No *</label>
                      <input
                        className={inputClass}
                        value={fields.enrollmentNo}
                        onChange={(e) =>
                          setFields((p) => ({
                            ...p,
                            enrollmentNo: e.target.value,
                          }))
                        }
                        placeholder="Your enrollment number"
                      />
                    </div>
                  </div>

                  {/* Status messages */}
                  {status === "duplicate" && (
                    <p className="text-nx-coral text-sm mt-4 text-center">
                      You&apos;re already registered for this event.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-nx-coral text-sm mt-4 text-center">
                      Something went wrong. Please try again or email us
                      directly.
                    </p>
                  )}

                  {/* Submit */}
                  <div className="mt-6">
                    <RadialGlowButton
                      size="lg"
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={status === "loading"}
                    >
                      {status === "loading"
                        ? "Registering..."
                        : "Confirm Registration"}
                    </RadialGlowButton>
                  </div>

                  <p className="text-nx-muted text-xs text-center mt-4">
                    Already registered?{" "}
                    <a href="/events" className="text-nx-orchid hover:underline">
                      Browse events →
                    </a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </AuroraBackground>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2 } from "lucide-react"
import RadialGlowButton from "@/components/ui/RadialGlowButton"

interface RegistrationModalProps {
  eventId: string
  eventName: string
  onClose: () => void
}

export default function RegistrationModal({
  eventId,
  eventName,
  onClose
}: RegistrationModalProps) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    year: "",
    enrollmentNo: ""
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const handleSubmit = async () => {
    // Basic verification
    if (
      !fields.name.trim() ||
      !fields.email.trim() ||
      !fields.phone.trim() ||
      !fields.branch ||
      !fields.year ||
      !fields.enrollmentNo.trim()
    ) {
      return
    }

    setStatus("loading")
    try {
      const res = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, ...fields }),
      })
      if (res.status === 201) {
        setStatus("success")
      } else if (res.status === 409) {
        setStatus("duplicate")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const inputClass = "w-full bg-nx-bg border border-nx-purple/25 rounded-xl px-4 py-3 text-nx-text text-sm focus:border-nx-orchid outline-none transition-colors"
  const labelClass = "block text-nx-muted text-[11px] uppercase tracking-wider mb-1.5"

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-nx-surface/90 backdrop-blur-xl border border-nx-purple/25 rounded-2xl max-w-md w-full relative p-8 my-auto text-left"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-nx-muted hover:text-nx-text transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <p className="text-nx-orchid text-[11px] uppercase tracking-[2px] mb-1">
              Register for Event
            </p>
            <h2 className="text-nx-text font-outfit font-bold text-xl leading-tight">
              {eventName}
            </h2>
          </div>

          {/* SUCCESS STATE */}
          {status === "success" ? (
            <div className="text-center py-6">
              <CheckCircle2 size={48} className="text-nx-orchid mx-auto mb-4" />
              <p className="text-nx-text font-bold text-xl mb-2">You&apos;re registered!</p>
              <p className="text-nx-muted text-sm mb-6">
                Confirmation email sent to {fields.email}
              </p>
              <RadialGlowButton variant="ghost" size="md" onClick={onClose} className="w-full">
                Close
              </RadialGlowButton>
            </div>
          ) : (
            /* FORM STATE */
            <div className="flex flex-col">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    className={inputClass}
                    value={fields.name}
                    onChange={e => setFields(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={fields.email}
                    onChange={e => setFields(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    className={inputClass}
                    value={fields.phone}
                    onChange={e => setFields(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-nx-text">
                  <div>
                    <label className={labelClass}>Branch</label>
                    <select
                      className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A0AEC0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65em_auto] bg-[right_1rem_center] bg-no-repeat`}
                      value={fields.branch}
                      onChange={e => setFields(p => ({ ...p, branch: e.target.value }))}
                    >
                      <option value="" className="bg-nx-bg">Select branch</option>
                      <option className="bg-nx-bg">Automobile Engineering</option>
                      <option className="bg-nx-bg">Computer Science</option>
                      <option className="bg-nx-bg">Mechanical Engineering</option>
                      <option className="bg-nx-bg">Electronics & Communication</option>
                      <option className="bg-nx-bg">Civil Engineering</option>
                      <option className="bg-nx-bg">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Year</label>
                    <select
                      className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A0AEC0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65em_auto] bg-[right_1rem_center] bg-no-repeat`}
                      value={fields.year}
                      onChange={e => setFields(p => ({ ...p, year: e.target.value }))}
                    >
                      <option value="" className="bg-nx-bg">Select year</option>
                      <option className="bg-nx-bg">1st Year</option>
                      <option className="bg-nx-bg">2nd Year</option>
                      <option className="bg-nx-bg">3rd Year</option>
                      <option className="bg-nx-bg">4th Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Enrollment No</label>
                  <input
                    className={inputClass}
                    value={fields.enrollmentNo}
                    onChange={e => setFields(p => ({ ...p, enrollmentNo: e.target.value }))}
                    placeholder="Your enrollment number"
                  />
                </div>
              </div>

              {/* Error messages */}
              {status === "duplicate" && (
                <p className="text-nx-coral text-sm mt-3">
                  You&apos;re already registered for this event.
                </p>
              )}
              {status === "error" && (
                <p className="text-nx-coral text-sm mt-3">
                  Something went wrong. Please try again.
                </p>
              )}

              <RadialGlowButton
                size="lg"
                className="w-full mt-5"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Registering..." : "Confirm Registration"}
              </RadialGlowButton>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

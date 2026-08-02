"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Instagram, Linkedin } from "lucide-react"
import SectionHeader from "@/components/ui/SectionHeader"
import RadialGlowButton from "@/components/ui/RadialGlowButton"

const inputClass =
  "w-full bg-nx-bg border border-nx-purple/25 rounded-xl px-4 py-3 text-nx-text text-sm focus:border-nx-orchid outline-none transition-colors duration-200"
const labelClass =
  "block text-nx-muted text-[11px] uppercase tracking-wider mb-2"

interface ContactSectionProps {
  id?: string
}

export default function ContactSection({ id }: ContactSectionProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("sent")
        setForm({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id={id} className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* LEFT — Info */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
          viewport={{ once: true }}
        >
          <SectionHeader eyebrow="Get in touch" title="Contact Us" centered={false} />

          {/* Email block */}
          <div className="flex items-start gap-4 mt-8">
            <Mail size={20} className="text-nx-orchid mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-nx-text text-sm font-semibold mb-1">Email</p>
              <a
                href="mailto:nexurargpv@gmail.com"
                className="text-nx-muted text-sm hover:text-nx-orchid transition-colors"
              >
                nexurargpv@gmail.com
              </a>
            </div>
          </div>

          {/* Phone block */}
          <div className="flex items-start gap-4 mt-6">
            <Phone size={20} className="text-nx-orchid mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-nx-text text-sm font-semibold mb-2">Phone</p>
              <p className="text-nx-muted text-xs leading-6">Pawan Soni: +91 7477098233</p>
              <p className="text-nx-muted text-xs leading-6">Astha Pawar: +91 8305566978</p>
              <p className="text-nx-muted text-xs leading-6">Soumya Shrivastava: +91 9630012262</p>
            </div>
          </div>

          {/* Social block */}
          <div className="mt-8">
            <p className="text-nx-text text-sm font-semibold mb-3">Follow Us</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://www.instagram.com/nexura_rgpv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-nx-muted hover:text-nx-orchid border border-nx-purple/25 hover:border-nx-orchid/50 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Instagram size={16} /> Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/nexura-rgpv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-nx-muted hover:text-nx-orchid border border-nx-purple/25 hover:border-nx-orchid/50 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] as const }}
          viewport={{ once: true }}
        >
          <div className="bg-nx-surface/60 backdrop-blur-xl border border-nx-purple/25 rounded-2xl p-8">

            <div className="mb-5">
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                className={inputClass}
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                aria-label="Full Name"
              />
            </div>

            <div className="mb-5">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                aria-label="Email address"
              />
            </div>

            <div className="mb-6">
              <label className={labelClass}>Message</label>
              <textarea
                className={inputClass + " resize-none"}
                rows={5}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Tell us what's on your mind..."
                aria-label="Message"
              />
            </div>

            <RadialGlowButton
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : "Send Message"}
            </RadialGlowButton>

            {status === "sent" && (
              <p className="text-nx-orchid text-sm mt-3 text-center">
                ✓ Message sent! We&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-nx-coral text-sm mt-3 text-center">
                Failed to send. Please email us directly.
              </p>
            )}

          </div>
        </motion.div>

      </div>
    </section>
  )
}

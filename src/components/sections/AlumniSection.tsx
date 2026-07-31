"use client"
import { motion } from "framer-motion"
import { Linkedin, GraduationCap, User } from "lucide-react"
import { ALUMNI } from "@/data/alumni"
import { IAlumni } from "@/types"

function AlumniCard({ alumni, index }: { alumni: IAlumni; index: number }) {
  // Get initials for fallback
  const initials = alumni.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      viewport={{ once: true }}
      className="al-card-hover relative rounded-2xl overflow-hidden flex flex-col
                 bg-nx-surface/60 backdrop-blur-xl
                 border border-[rgba(212,168,83,0.4)]
                 hover:border-[rgba(212,168,83,0.8)]
                 hover:-translate-y-1.5
                 transition-all duration-300"
      style={{
        boxShadow: "0 0 0 rgba(212,168,83,0)",
      }}
    >
      {/* ── GLASS CUBE / IMAGE TOP AREA ── */}
      <div className="relative h-48 overflow-hidden flex items-center justify-center">

        {/* Subtle gold tint background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,168,83,0.06) 0%, rgba(212,168,83,0.02) 100%)",
          }}
        />

        {/* Main image container */}
        <div
          className="al-glass-cube relative z-10 w-24 h-24 rounded-[22px] overflow-hidden
                     flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,168,83,0.18) 0%, rgba(212,168,83,0.06) 100%)",
            border: "0.5px solid rgba(212,168,83,0.5)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          {alumni.image ? (
            <img
              src={alumni.image}
              alt={alumni.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#D4A853]">
              <User size={32} className="opacity-80 mb-0.5" />
              <span className="text-[11px] font-bold tracking-wider font-outfit">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Gradient fade into card body */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(15,10,29,0.98) 0%, rgba(15,10,29,0.3) 55%, transparent 100%)",
          }}
        />

        {/* Batch badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[9px] uppercase tracking-wider font-medium
                       px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{
              color: "#D4A853",
              background: "rgba(212,168,83,0.12)",
              border: "0.5px solid rgba(212,168,83,0.35)",
            }}
          >
            <GraduationCap size={9} />
            {alumni.batch}
          </span>
        </div>

        {/* Bottom shimmer */}
        <div className="al-shimmer" />

      </div>

      {/* ── CARD BODY ── */}
      <div className="px-4 pb-4 flex flex-col flex-1">

        {/* Name */}
        <h3 className="text-nx-text font-outfit font-semibold text-base
                       leading-tight mb-2">
          {alumni.name}
        </h3>

        {/* Current status */}
        <p className="text-nx-muted text-xs leading-relaxed mb-4 flex-1">
          {alumni.currentRole && alumni.company ? (
            <>
              Currently working as{" "}
              <span style={{ color: "#D4A853" }}>{alumni.currentRole}</span> at{" "}
              <span style={{ color: "#D4A853" }}>{alumni.company}</span>
            </>
          ) : alumni.currentRole ? (
            <>
              <span style={{ color: "#D4A853" }}>{alumni.currentRole}</span>
            </>
          ) : (
            <span className="text-nx-muted/50">Status not added</span>
          )}
        </p>

        {/* LinkedIn button */}
        {alumni.linkedin ? (
          <a
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2
                       py-2 rounded-xl text-xs font-medium
                       transition-all duration-200"
            style={{
              color: "#D4A853",
              border: "0.5px solid rgba(212,168,83,0.35)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "rgba(212,168,83,0.08)"
              el.style.borderColor = "rgba(212,168,83,0.65)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "transparent"
              el.style.borderColor = "rgba(212,168,83,0.35)"
            }}
          >
            <Linkedin size={13} />
            View LinkedIn
          </a>
        ) : (
          <div
            className="py-2 rounded-xl text-xs text-center"
            style={{
              color: "rgba(212,168,83,0.25)",
              border: "0.5px solid rgba(212,168,83,0.1)",
            }}
          >
            LinkedIn not added
          </div>
        )}

      </div>

    </motion.div>
  )
}

export default function AlumniSection() {
  // Take only first 3 featured alumni
  const featured = ALUMNI.filter((a) => a.featured).slice(0, 3)

  // Hide entire section if no featured alumni defined yet
  if (featured.length === 0) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p
            className="text-[11px] uppercase tracking-[3px] font-medium mb-2"
            style={{ color: "#D4A853" }}
          >
            Where Nexura leads
          </p>
          <h2 className="font-outfit font-semibold text-2xl text-nx-text mb-1">
            Our Alumni
          </h2>
          <p className="text-nx-muted text-sm">
            Students who shaped Nexura and went on to make their mark
          </p>
        </motion.div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map((a, i) => (
            <AlumniCard key={a.id} alumni={a} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}

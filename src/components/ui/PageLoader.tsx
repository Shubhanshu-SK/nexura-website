"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings2 } from "lucide-react"

export default function PageLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Show only once per browser session
    const seen = sessionStorage.getItem("nx-loaded")
    if (seen) { setVisible(false); return }
    const t = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem("nx-loaded", "1")
    }, 2800)
    return () => clearTimeout(t)
  }, [])

  // Lock scroll while visible
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [visible])

  const letters = ["N", "E", "X", "U", "R", "A"]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nx-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#08050e",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 28,
          }}
        >
          <style>{`
            @keyframes nx-spin { to { transform: rotate(360deg); } }
            @keyframes nx-spin-rev { to { transform: rotate(-360deg); } }
          `}</style>

          {/* Ring + gear stack */}
          <div style={{ position: "relative", width: 120, height: 120 }}>

            {/* Outer glow ring */}
            <svg style={{ position: "absolute", inset: 0, filter: "blur(8px)", opacity: 0.45 }}
              width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#AA27E5" strokeWidth="3"
                strokeDasharray="200 114" strokeLinecap="round"
                style={{ transformOrigin: "60px 60px", animation: "nx-spin 1.2s linear infinite" }} />
            </svg>

            {/* Main ring */}
            <svg style={{ position: "absolute", inset: 0 }}
              width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#8B22B8" strokeWidth="2.5"
                strokeDasharray="180 134" strokeLinecap="round"
                style={{ transformOrigin: "60px 60px", animation: "nx-spin 1.2s linear infinite" }} />
            </svg>

            {/* Inner ring opposite direction */}
            <svg style={{ position: "absolute", inset: 10 }}
              width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(139,34,184,0.3)" strokeWidth="1.5"
                strokeDasharray="100 139" strokeLinecap="round"
                style={{ transformOrigin: "50px 50px", animation: "nx-spin-rev 2s linear infinite" }} />
            </svg>

            {/* Gear center */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{ animation: "nx-spin-rev 3s linear infinite" }}
              >
                <Settings2 size={28} color="#AA27E5"
                  style={{ filter: "drop-shadow(0 0 6px rgba(170,39,229,0.7))" }} />
              </motion.div>
            </div>

          </div>

          {/* NEXURA letter-by-letter */}
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontFamily: "var(--font-outfit, Outfit, sans-serif)",
                  fontSize: 38, fontWeight: 800,
                  color: "#AA27E5", letterSpacing: "0.2em",
                  textShadow: "0 0 24px rgba(170,39,229,0.6), 0 0 48px rgba(139,34,184,0.3)",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            style={{
              color: "#A0AEC0", fontSize: 10,
              letterSpacing: "3px", textTransform: "uppercase",
              fontFamily: "var(--font-inter, Inter, sans-serif)",
              margin: 0,
            }}
          >
            Creation Leads, Victory Follows
          </motion.p>

          {/* Bottom progress line */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 2, background: "rgba(139,34,184,0.1)",
          }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.6, ease: "linear" }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #8B22B8, #AA27E5, #CC55FF)",
                boxShadow: "0 0 8px rgba(170,39,229,0.6)",
              }}
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

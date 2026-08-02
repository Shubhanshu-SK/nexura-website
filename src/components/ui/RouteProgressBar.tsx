"use client"
import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function RouteProgressBar() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const completeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    // Start bar on route change
    setVisible(true)
    setProgress(0)

    // Quick fill to 80%
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 80) { clearInterval(intervalRef.current); return 80 }
        return p + 15
      })
    }, 100)

    // Complete after 600ms
    completeRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
    }, 600)

    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(completeRef.current)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-bar"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0,
            height: 2, zIndex: 9998, pointerEvents: "none",
            background: "rgba(139,34,184,0.1)",
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #8B22B8, #AA27E5, #CC55FF)",
              boxShadow: "0 0 10px rgba(170,39,229,0.8), 0 0 20px rgba(170,39,229,0.4)",
              position: "relative",
            }}
          >
            {/* Leading glow dot */}
            <div style={{
              position: "absolute", right: -3, top: "50%",
              transform: "translateY(-50%)",
              width: 6, height: 6, borderRadius: "50%",
              background: "#CC55FF",
              boxShadow: "0 0 8px 3px rgba(204,85,255,0.9)",
            }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

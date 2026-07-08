"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { FAQS } from "@/data/faqs"
import SectionHeader from "@/components/ui/SectionHeader"

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">

        <SectionHeader eyebrow="Have questions" title="Frequently Asked" centered />

        <motion.div
          className="mt-12 flex flex-col gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {FAQS.map((faq, i) => {
            const isOpen = activeIndex === i
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } }
                }}
              >
                <div
                  className={[
                    "rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-300",
                    "bg-nx-surface/60",
                    isOpen
                      ? "border-nx-orchid/50 shadow-[0_0_20px_rgba(170,39,229,0.1)]"
                      : "border-nx-purple/25 hover:border-nx-orchid/30"
                  ].join(" ")}
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveIndex(isOpen ? null : i)
                    }
                  }}
                >
                  {/* Question row */}
                  <div className="flex justify-between items-center p-5 gap-4">
                    <span className="text-nx-text text-sm font-semibold leading-snug">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={18} className="text-nx-muted" />
                    </motion.div>
                  </div>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="px-5 pb-5 text-nx-muted text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

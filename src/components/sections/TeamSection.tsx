"use client"

import React from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/ui/SectionHeader"
import RadialGlowButton from "@/components/ui/RadialGlowButton"
import CylinderCarousel, { CarouselCard } from "@/components/ui/CylinderCarousel"
import { MEMBERS } from "@/data/members"

export default function TeamSection() {
  // Exclude faculty mentors from the homepage auto-rotating carousel to show the student core team
  const studentMembers = MEMBERS.filter(m => m.category !== "Faculty Mentor")
  
  const cards: CarouselCard[] = studentMembers.map(m => ({
    imageSrc: m.photo,
    imageAlt: m.name,
    name: m.name,
    role: m.role,
    initials: m.initials,
    gradientFrom: m.gradientFrom,
    gradientTo: m.gradientTo,
  }))

  return (
    <section className="py-20 px-4 bg-nx-bg overflow-hidden">
      {/* Framer Motion entrance on header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true }}
      >
        <SectionHeader
          eyebrow="Who we are"
          title="Meet the Team"
          subtitle="Auto-rotating"
          centered
        />
      </motion.div>

      {/* Carousel — NO Framer Motion wrapper here */}
      <div className="mt-12">
        <CylinderCarousel
          cards={cards}
          animationDuration={28}
          cardWidth={220}
        />
      </div>

      {/* Framer Motion entrance on button */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true }}
      >
        <RadialGlowButton size="md" href="/team">
          View Full Team →
        </RadialGlowButton>
      </motion.div>
    </section>
  )
}

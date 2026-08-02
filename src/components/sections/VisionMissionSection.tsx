"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import AuroraBackground from "@/components/ui/AuroraBackground";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

export default function VisionMissionSection() {
  return (
    <AuroraBackground className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Our Purpose" title="Vision & Mission" />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={cardVariants}
          >
            <GlassCard className="p-8">
              <Eye size={36} className="text-nx-orchid mb-4" />
              <h3 className="font-outfit text-xl font-bold text-nx-text mb-3">
                Our Vision
              </h3>
              <p className="text-nx-muted text-sm leading-relaxed">
                To become a hub of creativity and technical excellence,
                empowering students to lead innovation in automotive engineering
                and beyond.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
            variants={cardVariants}
          >
            <GlassCard className="p-8">
              <Target size={36} className="text-nx-orchid mb-4" />
              <h3 className="font-outfit text-xl font-bold text-nx-text mb-3">
                Our Mission
              </h3>
              <p className="text-nx-muted text-sm leading-relaxed">
                To foster innovation in engineering by bridging the gap between
                traditional mechanical design and modern digital skills through
                hands-on learning.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
}

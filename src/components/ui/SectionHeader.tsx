"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={centered ? "text-center" : ""}
    >
      <p className="text-nx-orchid text-[11px] tracking-[3px] uppercase mb-2">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold font-outfit text-nx-text mb-3">{title}</h2>
      {subtitle ? <p className="text-nx-muted text-sm">{subtitle}</p> : null}
    </motion.div>
  );
}

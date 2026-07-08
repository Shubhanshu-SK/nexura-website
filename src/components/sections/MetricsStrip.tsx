"use client";

import { motion } from "framer-motion";

const metrics = [
  { val: "5", label: "Domains" },
  { val: "250+", label: "Members" },
  { val: "12+", label: "Workshops" },
  { val: "3", label: "Faculty Leads" },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cellVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function MetricsStrip() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="border-y border-nx-purple/15 py-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 lg:grid-cols-4">
        {metrics.map(({ val, label }, index) => (
          <motion.div
            key={label}
            variants={cellVariants}
            className={`border-nx-purple/10 px-6 text-center ${
              index !== metrics.length - 1 ? "border-r" : ""
            } ${(index + 1) % 2 === 0 ? "max-lg:border-r-0" : ""} ${
              index < 2 ? "max-lg:border-b" : ""
            }`}
          >
            <p className="font-outfit text-4xl font-bold text-nx-orchid">
              {val}
            </p>
            <p className="text-nx-muted mt-1 text-[11px] tracking-widest uppercase">
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

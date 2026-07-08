"use client";

import { motion } from "framer-motion";
import {
  Box,
  Code2,
  Megaphone,
  Settings2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import AuroraBackground from "@/components/ui/AuroraBackground";
import RadialGlowButton from "@/components/ui/RadialGlowButton";

const APPLY_URL = "https://forms.gle/pdaLG1936wXXB2ui7";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const orbitChips = [
  {
    icon: Sparkles,
    className: "top-[5%] left-[15%]",
    delay: "0s",
    lineTo: { x: 45, y: 15 },
  },
  {
    icon: Code2,
    className: "top-[10%] right-[10%]",
    delay: "0.6s",
    lineTo: { x: 270, y: 30 },
  },
  {
    icon: Box,
    className: "bottom-[20%] left-[5%]",
    delay: "1.2s",
    lineTo: { x: 15, y: 240 },
  },
  {
    icon: Settings2,
    className: "bottom-[10%] right-[15%]",
    delay: "1.8s",
    lineTo: { x: 255, y: 270 },
  },
  {
    icon: Megaphone,
    className: "top-[50%] left-[-5%]",
    delay: "0.3s",
    lineTo: { x: 0, y: 150 },
  },
] as const;

interface HeroSectionProps {
  id?: string
}

export default function HeroSection({ id = "home" }: HeroSectionProps) {
  return (
    <div id={id}>
      <AuroraBackground className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col-reverse items-center gap-12 px-6 pt-24 pb-16 lg:flex-row lg:gap-16 lg:pt-0 lg:pb-0">
        <motion.div
          className="flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="text-nx-orchid text-[11px] tracking-[3px] uppercase"
          >
            UIT-RGPV · Automobile Engineering
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-outfit text-4xl font-extrabold text-nx-text lg:text-6xl"
          >
            Welcome to
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-outfit text-4xl font-extrabold lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-nx-purple to-nx-orchid bg-clip-text text-transparent">
              NEXURA
            </span>
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-nx-muted mt-2 text-lg italic"
          >
            Creation Leads, Victory Follows
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-nx-muted mt-4 max-w-md text-sm leading-relaxed"
          >
            A student-led club bridging mechanical design with digital
            engineering.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-4"
          >
            <RadialGlowButton
              size="lg"
              href={APPLY_URL}
              target="_blank"
            >
              Apply to Domains
            </RadialGlowButton>
            <RadialGlowButton variant="ghost" size="lg" href="/events">
              Browse Events
            </RadialGlowButton>
          </motion.div>
        </motion.div>

        <div className="relative flex min-h-[320px] flex-1 items-center justify-center lg:min-h-[400px]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 300 300"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {orbitChips.map(({ lineTo }, index) => (
              <line
                key={index}
                x1={150}
                y1={150}
                x2={lineTo.x}
                y2={lineTo.y}
                stroke="rgba(139,34,184,0.2)"
                strokeDasharray="4 6"
              />
            ))}
          </svg>

          {orbitChips.map(({ icon: Icon, className, delay }, index) => (
            <div
              key={index}
              className={`animate-chip-float absolute flex h-12 w-12 items-center justify-center rounded-xl border border-nx-purple/25 bg-nx-surface/60 backdrop-blur-xl ${className}`}
              style={{ animationDelay: delay }}
            >
              <Icon size={20} className="text-nx-orchid" />
            </div>
          ))}

          <div className="animate-float relative z-10 ">
            <Image
              src="/images/NavLogo.png"
              alt="Nexura logo"
              width={700}
              height={700}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </AuroraBackground>
    </div>
  );
}

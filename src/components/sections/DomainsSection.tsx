"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  CheckCircle2,
  ChevronDown,
  Code2,
  Megaphone,
  Settings2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DOMAINS } from "@/data/domains";
import type { IDomainData } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import RadialGlowButton from "@/components/ui/RadialGlowButton";
import SectionHeader from "@/components/ui/SectionHeader";

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Code2,
  Box,
  Settings2,
  Megaphone,
};

const panelTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

const mobilePanelTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface DomainsSectionProps {
  id?: string;
}

function getDomainIcon(iconName: string): LucideIcon {
  return LUCIDE_ICONS[iconName] ?? Sparkles;
}

function DomainDetailContent({ domain }: { domain: IDomainData }) {
  return (
    <>
      <span className="text-nx-orchid mb-4 inline-block rounded border border-nx-purple/30 bg-nx-purple/10 px-2 py-0.5 text-[10px] tracking-wider uppercase">
        {domain.tag}
      </span>
      <h3 className="font-outfit mb-3 text-xl font-bold text-nx-text">
        {domain.name}
      </h3>
      <p className="text-nx-muted mb-4 text-xs leading-relaxed">
        {domain.description}
      </p>
      <ul className="list-none">
        {domain.bullets.map((bullet) => (
          <li key={bullet} className="mb-2 flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-nx-orchid" />
            <span className="text-nx-muted text-xs">{bullet}</span>
          </li>
        ))}
      </ul>
      <RadialGlowButton
        size="sm"
        className="mt-4"
        href={domain.portfolioUrl}
        target="_blank"
      >
        View Portfolio →
      </RadialGlowButton>
    </>
  );
}

function DomainCenterVisual({ domain }: { domain: IDomainData }) {
  const Icon = getDomainIcon(domain.iconName);

  return (
    <GlassCard className="flex h-64 w-64 flex-col items-center justify-center gap-6">
      <Icon size={72} className="text-nx-orchid" />
      <p className="text-nx-muted text-sm font-medium">{domain.name}</p>
    </GlassCard>
  );
}

function DomainSidebarTabs({
  activeDomain,
  pointerEventsNone = true,
}: {
  activeDomain: number;
  pointerEventsNone?: boolean;
}) {
  return (
    <div
      className={`flex w-44 flex-shrink-0 flex-col justify-center border-r border-nx-purple/15 pr-8 ${
        pointerEventsNone ? "pointer-events-none" : ""
      }`}
    >
      <p className="text-nx-muted mb-8 text-xs tracking-wider uppercase">
        Explore by
      </p>
      {DOMAINS.map((domain, index) => {
        const isActive = index === activeDomain;
        return (
          <div
            key={domain.id}
            className={`flex items-center gap-3 border-l-2 py-3 pl-3 transition-all duration-300 ${
              isActive
                ? "border-nx-orchid text-nx-text"
                : "border-transparent text-nx-muted"
            }`}
          >
            <span className="flex-1 text-sm">{domain.name}</span>
            <span
              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full bg-nx-orchid transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

function MobileDomainContent({ domain }: { domain: IDomainData }) {
  const Icon = getDomainIcon(domain.iconName);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <GlassCard className="mb-2 flex h-36 w-36 items-center justify-center rounded-3xl">
        <Icon size={64} className="text-nx-orchid" />
      </GlassCard>
      <h3 className="font-outfit text-2xl font-bold text-nx-text">
        {domain.name}
      </h3>
      <span className="text-nx-orchid inline-block rounded border border-nx-purple/30 bg-nx-purple/10 px-2 py-0.5 text-[10px] tracking-wider uppercase">
        {domain.tag}
      </span>
      <p className="text-nx-muted mx-auto max-w-[280px] text-sm leading-relaxed">
        {domain.description}
      </p>
      <ul className="list-none">
        {domain.bullets.map((bullet) => (
          <li
            key={bullet}
            className="mb-2 flex items-center justify-center gap-2"
          >
            <span className="h-1 w-1 flex-shrink-0 rounded-full bg-nx-orchid" />
            <span className="text-nx-muted text-xs">{bullet}</span>
          </li>
        ))}
      </ul>
      <RadialGlowButton
        size="sm"
        href={domain.portfolioUrl}
        target="_blank"
        className="mt-2"
      >
        View Portfolio →
      </RadialGlowButton>
    </div>
  );
}

export default function DomainsSection({ id = "domains" }: DomainsSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeDomain, setActiveDomain] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!outerRef.current) return;

      const top = outerRef.current.getBoundingClientRect().top;
      const offset = -top;
      const next = Math.min(Math.max(Math.floor(offset / 200), 0), 4);
      setActiveDomain(next);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const domain = DOMAINS[activeDomain];

  return (
    <div
      ref={outerRef}
      id={id}
      className="relative"
      style={{ height: "calc(100vh + 1000px)" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Desktop header */}
        <div className="absolute top-12 right-0 left-0 hidden justify-center lg:flex">
          <SectionHeader eyebrow="What we do" title="Explore by Domain" />
        </div>

        {/* Desktop 3-column layout */}
        <div className="mx-auto hidden h-full max-w-7xl items-center px-6 pt-16 lg:flex">
          <DomainSidebarTabs activeDomain={activeDomain} />

          <div className="flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={panelTransition}
              >
                <DomainCenterVisual domain={domain} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex w-60 flex-shrink-0 flex-col justify-center pl-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={panelTransition}
              >
                <DomainDetailContent domain={domain} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile scroll storytelling layout */}
        <div className="relative flex h-full flex-col items-center justify-center px-5 lg:hidden">
          <div className="absolute top-8 right-0 left-0 text-center">
            <SectionHeader eyebrow="What we do" title="Explore by Domain" />
          </div>

          <div className="absolute top-[140px] right-0 left-0 flex justify-center gap-3">
            {DOMAINS.map((item, index) => (
              <span
                key={item.id}
                className={`h-2 w-2 rounded-full transition-all duration-[400ms] ${
                  index === activeDomain
                    ? "scale-125 bg-nx-orchid shadow-[0_0_8px_rgba(170,39,229,0.8)]"
                    : "scale-100 bg-nx-purple/30"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={mobilePanelTransition}
              >
                <MobileDomainContent domain={domain} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute right-0 bottom-[60px] left-0 text-center">
            <AnimatePresence mode="wait">
              {activeDomain < 4 ? (
                <motion.div
                  key="scroll-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, -6, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    y: {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    },
                  }}
                  className="flex flex-col items-center"
                >
                  <ChevronDown size={20} className="text-nx-muted" />
                  <p className="text-nx-muted mt-1 text-[10px] tracking-widest uppercase">
                    Scroll to explore
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 size={20} className="text-nx-orchid" />
                  <p className="text-nx-orchid mt-1 text-[10px] tracking-widest uppercase">
                    All domains explored
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-nx-purple/20">
          <div
            className="h-full bg-nx-orchid transition-all duration-500"
            style={{ width: `${(activeDomain / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

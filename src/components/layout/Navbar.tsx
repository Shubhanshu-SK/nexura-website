"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Home,
  LayoutGrid,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

interface NavIconLinkProps {
  href: string;
  icon: ReactNode;
  tooltip: string;
  iconClassName?: string;
}

function NavIconLink({
  href,
  icon,
  tooltip,
  iconClassName = "text-nx-muted hover:text-nx-orchid",
}: NavIconLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        aria-label={tooltip}
        className={`inline-flex transition-all duration-200 ${iconClassName}`}
      >
        {icon}
      </Link>
      <AnimatePresence>
        {isHovered ? (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-nx-purple/25 bg-nx-surface px-2 py-1 text-xs text-nx-text"
          >
            {tooltip}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-14 border-b border-nx-purple/20 backdrop-blur-xl transition-colors duration-300 ${scrolled ? "bg-nx-bg/80" : "bg-nx-bg/40"
        }`}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center px-3 lg:px-6">
        <div className="flex flex-1 items-center gap-8">
          <NavIconLink
            href="/#home"
            icon={<Home size={18} />}
            tooltip="Home"
          />
          <NavIconLink
            href="/#domains"
            icon={<LayoutGrid size={18} />}
            tooltip="Domains"
          />
          <NavIconLink
            href="/events"
            icon={<CalendarDays size={18} />}
            tooltip="Events"
          />

        </div>

        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/"
            className="transition-[filter] duration-300 hover:drop-shadow-[0_0_8px_rgba(170,39,229,0.6)]"
          >
            <Image
              src="/images/LOGO NEXURA 1.png"
              alt="Nexura"
              width={36}
              height={36}
              className="object-contain filter brightness-100 contrast-100 "
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center gap-8 justify-end">
          <NavIconLink
            href="/team"
            icon={<Users size={18} />}
            tooltip="Team"
          />
          <NavIconLink
            href="/admin/login"
            icon={<ShieldCheck size={18} />}
            tooltip="Admin"
            iconClassName="text-nx-muted hover:text-nx-coral"
          />
        </div>
      </nav>
    </header>
  );
}

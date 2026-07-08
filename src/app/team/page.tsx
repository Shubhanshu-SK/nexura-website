"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Search,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Globe,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { MEMBERS } from "@/data/members";

type CategoryFilter = "All" | "Faculty Mentor" | "Admin" | "Domain Lead" | "Member";

const filterOptions: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "All" },
  { label: "Faculty Mentors", value: "Faculty Mentor" },
  { label: "Admin", value: "Admin" },
  { label: "Domain Leads", value: "Domain Lead" },
  { label: "Members", value: "Member" },
];

const categories = [
  { id: "Faculty Mentor", title: "Faculty Mentors" },
  { id: "Domain Lead", title: "Domain Leads" },
  { id: "Admin", title: "Admin Team" },
  { id: "Member", title: "Team Members" },
] as const;

// Animation variants
const pageEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All");

  // Dynamic search and filter processing
  const filteredMembers = MEMBERS.filter((member) => {
    // 1. Filter by category if not 'All'
    if (activeFilter !== "All" && member.category !== activeFilter) {
      return false;
    }
    // 2. Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesName = member.name.toLowerCase().includes(query);
      const matchesRole = member.role.toLowerCase().includes(query);
      const matchesSkill = member.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      );
      return matchesName || matchesRole || matchesSkill;
    }
    return true;
  });

  // Category grouping
  const categoryGroups = categories
    .map((cat) => ({
      ...cat,
      members: filteredMembers.filter((m) => m.category === cat.id),
    }))
    .filter((group) => group.members.length > 0);

  const hasResults = categoryGroups.length > 0;

  return (
    <main className="min-h-screen bg-nx-bg text-nx-text py-16 px-4 md:px-8 relative overflow-hidden select-none">
      {/* Aurora Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[60%] rounded-full bg-nx-purple/10 blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[50%] rounded-full bg-nx-orchid/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO SECTION */}
        <motion.div
          variants={pageEntranceVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.h1
            variants={pageEntranceVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight mb-4"
          >
            Meet Our{" "}
            <span className="bg-gradient-to-r from-nx-orchid via-nx-purple to-nx-coral bg-clip-text text-transparent">
              Team
            </span>
          </motion.h1>
          <motion.p
            variants={pageEntranceVariants}
            className="text-nx-muted text-sm md:text-base font-inter max-w-2xl mx-auto"
          >
            The dedicated developers, 3D animators, UI/UX designers, parametric engineers, 
            and operations leads working together to drive innovation at Nexura.
          </motion.p>
        </motion.div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-nx-surface/30 backdrop-blur-xl border border-nx-purple/15 rounded-2xl p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-nx-muted">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, role or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nx-bg/60 border border-nx-purple/20 text-nx-text placeholder-nx-muted/60 focus:outline-none focus:ring-1 focus:ring-nx-orchid/50 focus:border-nx-orchid/50 transition-all font-inter text-sm"
              aria-label="Search members"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-nx-orchid text-white border border-nx-orchid shadow-[0_0_12px_rgba(170,39,229,0.4)] cursor-pointer"
                      : "bg-nx-surface/60 border border-nx-purple/20 text-nx-muted hover:text-nx-text hover:border-nx-orchid/50 cursor-pointer"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MEMBER DIRECTORY LISTING */}
        <AnimatePresence mode="wait">
          {hasResults ? (
            <motion.div
              key={`${activeFilter}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {categoryGroups.map((group) => (
                <section key={group.id} className="space-y-6">
                  {/* Category Title */}
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-2xl font-bold font-outfit text-nx-text">
                      {group.title}
                    </h2>
                    <div className="h-px bg-gradient-to-r from-nx-purple/40 to-transparent flex-1" />
                    <span className="text-xs font-mono text-nx-muted bg-nx-surface/50 border border-nx-purple/15 px-2 py-0.5 rounded-md">
                      {group.members.length} {group.members.length === 1 ? "member" : "members"}
                    </span>
                  </div>

                  {/* Members Grid */}
                  <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                  >
                    {group.members.map((member) => (
                      <motion.div
                        key={member.name}
                        variants={cardVariants}
                        layout
                        className="relative overflow-hidden flex flex-col h-full rounded-2xl border border-nx-purple/20 bg-nx-surface/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-nx-orchid/50 hover:shadow-[0_0_24px_rgba(139,34,184,0.12)] group"
                      >
                        {/* Profile Image container */}
                        <div className="relative w-28 h-28 mx-auto mt-6 rounded-full overflow-hidden border-2 border-nx-purple/20 transition-all duration-300 group-hover:border-nx-orchid/55 select-none shrink-0">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                              draggable={false}
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-2xl font-bold font-outfit text-white"
                              style={{
                                background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`,
                              }}
                            >
                              <span className="opacity-90">{member.initials}</span>
                            </div>
                          )}
                        </div>

                        {/* Name + Admin Badge Icon */}
                        <div className="mt-4 text-center px-4 flex items-center justify-center gap-1.5 shrink-0">
                          {member.category === "Admin" && (
                            <ShieldCheck
                              className="text-nx-orchid w-4.5 h-4.5 shrink-0 fill-nx-orchid/15"
                              aria-label="Admin Badge"
                            />
                          )}
                          <h3 className="text-nx-text font-outfit font-semibold text-base md:text-lg leading-tight transition-colors duration-300 group-hover:text-nx-orchid truncate max-w-[85%]">
                            {member.name}
                          </h3>
                        </div>

                        {/* Post/Role */}
                        <p className="text-nx-muted font-inter text-xs text-center mt-1 px-4 shrink-0 truncate">
                          {member.role}
                        </p>

                        {/* Bio description */}
                        {member.bio && (
                          <p className="text-nx-muted/70 font-inter text-[11px] md:text-xs text-center mt-3.5 px-5 line-clamp-3 italic leading-relaxed shrink-0">
                            "{member.bio}"
                          </p>
                        )}

                        {/* Skills chips */}
                        <div className="flex flex-wrap gap-1.5 justify-center mt-4 px-4 shrink-0">
                          {member.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] md:text-[10px] font-medium font-inter bg-nx-purple/10 border border-nx-purple/20 text-nx-orchid/90 px-2.5 py-0.5 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Social Links (mt-auto ensures aligned bottom placement) */}
                        <div className="mt-auto pt-6 pb-5 flex items-center justify-center gap-4 shrink-0">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} LinkedIn`}
                              className="text-nx-muted hover:text-[#0077b5] hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <Linkedin size={17} />
                            </a>
                          )}
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} GitHub`}
                              className="text-nx-muted hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <Github size={17} />
                            </a>
                          )}
                          {member.instagram && (
                            <a
                              href={member.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} Instagram`}
                              className="text-nx-muted hover:text-[#e1306c] hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <Instagram size={17} />
                            </a>
                          )}
                          {member.twitter && (
                            <a
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} Twitter/X`}
                              className="text-nx-muted hover:text-[#1da1f2] hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <Twitter size={17} />
                            </a>
                          )}
                          {member.portfolio && (
                            <a
                              href={member.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} Portfolio Website`}
                              className="text-nx-muted hover:text-nx-coral hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <Globe size={17} />
                            </a>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              aria-label={`${member.name} Email`}
                              className="text-nx-muted hover:text-nx-orchid hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <Mail size={17} />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-nx-surface/20 border border-nx-purple/10 rounded-2xl max-w-md mx-auto"
            >
              <p className="text-nx-muted font-inter text-sm mb-1">
                No team members match your search criteria.
              </p>
              <p className="text-nx-orchid/70 font-inter text-xs">
                Try adjusting your search query or changing filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

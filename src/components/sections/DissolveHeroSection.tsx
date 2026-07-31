"use client"
import dynamic from "next/dynamic"

const ScrollDissolveReveal = dynamic(
  () => import("@/components/ui/ScrollDissolveReveal").then(m => ({ default: m.ScrollDissolveReveal })),
  { ssr: false }
)

export default function DissolveHeroSection() {
  return (
    <section className="w-full bg-nx-bg">
      {/* Mobile View */}
      <div className="block md:hidden">
        <ScrollDissolveReveal
          imageFront="/images/BG.png" // Mobile Front Image
          imageBack="/images/LOGO NEXURA 1.png"
          containerClassName="w-full"
          className="w-full"
        />
      </div>

      {/* Laptop / Desktop View */}
      <div className="hidden md:block">
        <ScrollDissolveReveal
          imageFront="/images/BG.png" // Laptop/Desktop Front Image
          imageBack="/images/LOGO NEXURA 1.png"
          containerClassName="w-full"
          className="w-full"
        />
      </div>
    </section>
  )
}

"use client"
import dynamic from "next/dynamic"

const ScrollDissolveReveal = dynamic(
  () => import("@/components/ui/ScrollDissolveReveal").then(m => ({ default: m.ScrollDissolveReveal })),
  { ssr: false }
)

export default function DissolveHeroSection() {
  return (
    <section className="w-full bg-nx-bg">
      <ScrollDissolveReveal
        imageFront="/images/BG.jpg"
        imageBack="/images/LOGO NEXURA 1.png"
        containerClassName="w-full"
        className="w-full"
      />
    </section>
  )
}

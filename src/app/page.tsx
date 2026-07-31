import HeroSection from "@/components/sections/HeroSection"
import MetricsStrip from "@/components/sections/MetricsStrip"
import VisionMissionSection from "@/components/sections/VisionMissionSection"
import DomainsSection from "@/components/sections/DomainsSection"
import TeamSection from "@/components/sections/TeamSection"
import AlumniSection from "@/components/sections/AlumniSection"
import UpcomingEventsSection from "@/components/sections/UpcomingEventsSection"
import FAQSection from "@/components/sections/FAQSection"
import ContactSection from "@/components/sections/ContactSection"

export default function HomePage() {
  return (
    <main>
      <HeroSection id="home" />
      <MetricsStrip />
      <VisionMissionSection />
      <UpcomingEventsSection />
      <AlumniSection />
      <DomainsSection id="domains" />
      <TeamSection />
      <FAQSection />
      <ContactSection id="contact" />
    </main>
  )
}

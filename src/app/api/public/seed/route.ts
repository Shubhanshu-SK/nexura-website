import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/dbConnect"
import Event from "@/models/Event"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Delete existing upcoming events to ensure clean seed
    await Event.deleteMany({ status: "Upcoming" })

    const sampleEvents = [
      {
        name: "Nexura CAD Workshop",
        description: "Hands-on experience with SolidWorks and finite element analysis (FEA) using ANSYS. Learn to construct complex parameters, run stress/thermal simulation, and optimize mechanical structures.",
        imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=640&auto=format&fit=crop",
        venue: "CAD Lab, Mechanical Dept",
        place: "On-campus",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: "10:00 AM - 1:00 PM",
        organizedBy: "Nexura Parametric Team",
        registrationLink: null,
        status: "Upcoming",
        stripbg: "#AA27E5",
        mode: "Offline"
      },
      {
        name: "3D Animation Masterclass",
        description: "Dive deep into Blender rendering, photorealistic lighting, and hard surface modeling tailored for automobile visualization. Learn vertex layouts and animation timelines.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop",
        venue: "Discord Server",
        place: "Virtual",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: "6:00 PM - 8:00 PM",
        organizedBy: "Nexura 3D Department",
        registrationLink: null,
        status: "Upcoming",
        stripbg: "#8B22B8",
        mode: "Online"
      },
      {
        name: "Nexura Frontend Hackathon",
        description: "Compete to build the most interactive automotive landing page using Next.js, Tailwind CSS, and Framer Motion. Show off your UI/UX and dev chops.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=640&auto=format&fit=crop",
        venue: "UIT-RGPV Campus",
        place: "On-campus",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        time: "9:00 AM - 5:00 PM",
        organizedBy: "Nexura Web Development Dept",
        registrationLink: "https://forms.gle/pdaLG1936wXXB2ui7",
        status: "Upcoming",
        stripbg: "#FF7F50",
        mode: "Offline"
      }
    ]

    const created = await Event.insertMany(sampleEvents)

    return NextResponse.json({
      success: true,
      message: "Seeded upcoming events successfully",
      count: created.length,
      events: created
    })
  } catch (error) {
    console.error("[Seed Error]", error)
    return NextResponse.json({ error: "Server error during seeding" }, { status: 500 })
  }
}

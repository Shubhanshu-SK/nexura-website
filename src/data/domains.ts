import type { IDomainData } from "@/types";

export const DOMAINS: IDomainData[] = [
  {
    id: 0,
    name: "UI/UX Design",
    iconName: "Sparkles",
    tag: "Design",
    portfolioUrl: "https://nexura-ui-ux-department.vercel.app/",
    description:
      "Crafting user-friendly digital experiences through Figma, wireframing, and prototyping.",
    bullets: [
      "User-centric wireframing",
      "Visual & interactive design",
      "Usability testing",
    ],
  },
  {
    id: 1,
    name: "Web Development",
    iconName: "Code2",
    tag: "Engineering",
    portfolioUrl: "https://nexura-webdevelopment-final.vercel.app/",
    description:
      "Full-stack systems from React frontends to Node.js backends.",
    bullets: [
      "Full-stack development",
      "Custom web applications",
      "API integration & backend",
    ],
  },
  {
    id: 2,
    name: "3D & Animation",
    iconName: "Box",
    tag: "Creative",
    portfolioUrl: "https://nexura-3-d-department.vercel.app/",
    description:
      "VFX, product visualization, and Blender animations for automotive projects.",
    bullets: [
      "High-quality 3D models",
      "Photorealistic rendering",
      "Motion graphics & VFX",
    ],
  },
  {
    id: 3,
    name: "Parametric & Simulation",
    iconName: "Settings2",
    tag: "Engineering",
    portfolioUrl: "https://parametric-modelling-dept-nexura.vercel.app/",
    description:
      "ANSYS and SolidWorks FEA simulations for real-world engineering design.",
    bullets: [
      "Advanced CAD modelling",
      "Finite Element Analysis",
      "Stress & thermal simulation",
    ],
  },
  {
    id: 4,
    name: "PR & Operations",
    iconName: "Megaphone",
    tag: "Management",
    portfolioUrl: "https://versal-nexura.vercel.app/",
    description:
      "Brand outreach, event coordination, and sponsor engagement.",
    bullets: [
      "Strategic communication",
      "Event planning & coordination",
      "Social media management",
    ],
  },
];

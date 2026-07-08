export interface IEvent {
  _id: string
  name: string
  description: string
  imageUrl: string
  venue: string
  place: string
  date: string
  time: string
  organizedBy: string
  registrationLink?: string | null
  status: "Upcoming" | "Completed"
  stripbg?: string
  mode?: string
  slug?: string
}

export interface IDomainData {
  id: number
  name: string
  iconName: string
  tag: string
  description: string
  bullets: string[]
  portfolioUrl: string
}

export interface IMember {
  name: string
  role: string
  initials: string
  gradientFrom: string
  gradientTo: string
  photo?: string
  skills: string[]
  linkedin?: string
  github?: string
  instagram?: string
  twitter?: string
  portfolio?: string
  email?: string
  bio?: string
  category: "Faculty Mentor" | "Admin" | "Domain Lead" | "Member"
}

export interface IFAQItem {
  question: string
  answer: string
}

export interface IRegistration {
  _id: string
  eventId: string
  name: string
  email: string
  phone: string
  institute: string
  branch: string
  year: string
  enrollmentNo: string
  createdAt: string
}

import mongoose, { Schema, Document, model, models } from "mongoose"

export interface IEventDocument extends Document {
  name: string
  description: string
  imageUrl: string
  venue: string
  place: string
  date: Date
  time: string
  organizedBy: string
  registrationLink?: string | null
  status: "Upcoming" | "Completed"
  stripbg?: string
  mode?: string
  speaker?: string
  host?: string
  domain?: string
  gallery?: string[]
  slug?: string
}

const EventSchema = new Schema<IEventDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    venue: { type: String, required: true },
    place: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    organizedBy: { type: String, required: true },
    registrationLink: { type: String, default: null },
    status: { type: String, enum: ["Upcoming", "Completed"], required: true },
    stripbg: { type: String },
    mode: { type: String, default: "Online" },
    speaker: { type: String, default: "" },
    host: { type: String, default: "" },
    domain: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    slug: { type: String, default: "" },
  },
  { timestamps: true }
)

export default models.Event || model<IEventDocument>("Event", EventSchema)

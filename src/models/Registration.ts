import mongoose, { Schema, Document, model, models } from "mongoose"

export interface IRegistrationDocument extends Document {
  eventId: mongoose.Types.ObjectId
  name: string
  email: string
  phone: string
  institute: string
  branch: string
  year: string
  enrollmentNo: string
}

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    institute: { type: String, required: true, default: "UIT" },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    enrollmentNo: { type: String, required: true },
  },
  { timestamps: true }
)

// Compound indexes to prevent duplicate email + eventId and duplicate enrollmentNo + eventId
RegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true })
RegistrationSchema.index({ eventId: 1, enrollmentNo: 1 }, { unique: true })

export default models.Registration ||
  model<IRegistrationDocument>("Registration", RegistrationSchema)

import mongoose, { Schema, Document, model, models } from "mongoose"
import bcrypt from "bcryptjs"

export interface IAdminDocument extends Document {
  username: string
  passwordHash: string
  comparePassword(plain: string): Promise<boolean>
}

const AdminSchema = new Schema<IAdminDocument>({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

AdminSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash)
}

export default models.Admin || model<IAdminDocument>("Admin", AdminSchema)

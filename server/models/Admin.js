import { Schema, model, mongoose } from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "super_admin" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
});

AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.models.Admin || model("Admin", AdminSchema);

import { Schema, model, mongoose } from "mongoose";

const VoterSchema = new Schema({
  voterId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  aadhaarNumber: { type: String },
  votedElections: [{ type: Schema.Types.ObjectId, ref: "Election" }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
  verifyOTP: { type: String },
});

export default mongoose.models.Voter || model("Voter", VoterSchema);

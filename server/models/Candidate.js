import { Schema, model, mongoose } from "mongoose";

const CandidateSchema = new Schema({
  candidateId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  party: { type: String },
  partySymbol: { type: String },
  position: { type: String },
  constituency: { type: String },
  photoUrl: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Candidate || model("Candidate", CandidateSchema);

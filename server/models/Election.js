import { Schema, model, mongoose } from "mongoose";

const ElectionSchema = new Schema({
  electionId: { type: String, required: true, unique: true },
  title: { type: String },
  description: { type: String, default: null },
  phase: { type: String, default: "draft" },
  startDateTime: { type: Date, required: true },
  resultReleased: { type: Boolean, default: false },
  endDateTime: { type: Date, required: true },
  candidateIds: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Election || model("Election", ElectionSchema);

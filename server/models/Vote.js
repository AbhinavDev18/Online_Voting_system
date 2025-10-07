import { Schema, model, mongoose } from "mongoose";

const VoteSchema = new Schema({
  voteId: { type: String, required: true, unique: true },
  encryptedVote: { type: String, default: null },
  electionId: { type: String, required: true },
  candidateId: { type: String, default: null },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  timestamp: { type: Date, default: () => new Date() },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Vote || model("Vote", VoteSchema);

import { Schema, model, mongoose } from "mongoose";

const VoteReceiptSchema = new Schema({
  receiptId: { type: String, required: true, unique: true },
  voterId: { type: String, required: true },
  electionId: { type: String, required: true },
  candidateId: { type: String, required: true },
  receiptCode: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.VoteReceipt ||  model("VoteReceipt", VoteReceiptSchema);

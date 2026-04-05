import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({

  amount: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  category: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  notes: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},{ timestamps:true });

export default mongoose.model("FinancialRecord", recordSchema);
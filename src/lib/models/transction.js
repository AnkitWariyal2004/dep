import mongoose from "mongoose";

const transctionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: true },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: "wallet", required: true },
  ammount: { type: Number, required: true },
  status: { type: String },
  type: { type: String, required: true },
  remark: { type: String 
  },
  createdon:{
    type:Date,
    default:Date.now
  },
  cumilative:{
    type:Number,
  }
});

const Transaction = mongoose.models.transaction || mongoose.model("transaction", transctionSchema);
export default Transaction;

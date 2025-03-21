import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: true }, // Ensure this is correct
  ammount: { type: Number, default: 0 },
});

const Wallet = mongoose.models.wallet || mongoose.model("wallet", walletSchema);
export default Wallet;

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Ensure this is correct
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);
export default Customer;

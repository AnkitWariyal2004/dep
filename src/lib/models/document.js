import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ["Pan", "Insurance"], required: true },
    panOption: { type: String }, // Store file path or URL
    name: { type: String, required: true },
    dob: { type: String, required: true },
    fatherName: { type: String, required: true },
    signImage: { type: String, immutable: true }, // Image fields immutable
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    remark: { type: String },
    aadharFront: { type: String, immutable: true }, //required true
    aadharBack: { type: String, immutable: true },  //required true
    photo: { type: String, immutable: true },
    previousPanImage: { type: String, immutable: true },
    blueBookImage: { type: String, immutable: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const Documents = mongoose.models.Documents || mongoose.model("Documents", applicationSchema);
export default Documents;

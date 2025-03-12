import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Pan", "Aadhar"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
//   photo: {
//     type: String, // Store file path or URL
//     // required: true,
//   },
  fatherName: {
    type: String,
    required: true,
  },
//   signImage: {
//     type: String, // Store file path or URL
//     // required: true,
//   },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  remark: {
    type: String,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId, ref: "user",
    required: true
  }
}, { timestamps: true });

const Documents= mongoose.models.documents || mongoose.model("documents", applicationSchema);
export default Documents;

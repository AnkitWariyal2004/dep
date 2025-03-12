import mongoose from 'mongoose';
const distributorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    address: {
      type: String,
      required: true
      },
      password:{
        type:String,
        required:true
      },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
      
  }, { timestamps: true });
  

  const Distributor = mongoose.models.distributers || mongoose.model('distributers', distributorSchema);

  export default Distributor
import mongoose from "mongoose";

const servicePriceSchema = new mongoose.Schema({
    newPenPrice:{
        type:Number,
        required:true
    },
    renewalPenPrice:{
        type:Number,
        required:true
    },
    insurancePrice:{
        type:Number,
        required:true
    }
});

const Price =
  mongoose.models.price || mongoose.model("price", servicePriceSchema);

export default Price;

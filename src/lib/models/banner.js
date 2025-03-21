import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String,trim: true },
  image: { type: String}, // URL or file path of the banner image
});

const Banner = mongoose.models.banner || mongoose.model("banner", bannerSchema);

export default Banner;

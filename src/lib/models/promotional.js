import mongoose from "mongoose";

const promotionalBannerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  image: { type: String, required: true }, // URL or file path of the banner image
  link: { type: String, trim: true }, // Optional: Redirect URL for promo details
});

const PromotionalBanner =
  mongoose.models.promotionalBanner || mongoose.model("promotionalBanner", promotionalBannerSchema);

export default PromotionalBanner;

import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
export default NewsletterSubscriber;

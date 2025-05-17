import mongoose from "mongoose";

const AffiliateStatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    affiliateSales: {
      type: [mongoose.Types.ObjectId],
      ref: "Transaction",
    },
  },
  { timestamps: true }
);

const AffiliateStat = mongoose.models.AffiliateStat || mongoose.model("AffiliateStat", AffiliateStatSchema);
export default AffiliateStat;
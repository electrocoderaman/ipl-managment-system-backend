import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "sponsor name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Sponsor", sponsorSchema);

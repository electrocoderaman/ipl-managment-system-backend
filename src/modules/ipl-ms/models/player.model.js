import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "player name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    role: {
      type: String,
      required: [true, "player role is required"],
      enum: {
        value: ["Batsman", "Bowler", "Wicket-Keeper", "All rounder"],
        message:
          "Role must be: 'Batsman','Bowler','Wicket-Keeper','All rounder' ",
      },
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "team is required"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Player", playerSchema);

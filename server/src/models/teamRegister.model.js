const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, minlength: 3, maxlength: 20 },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaderCodeforcesHandle: { type: String },
    memberCodeforcesHandles: [{ type: String }],
  },
  { timestamps: true },
);

// Prevent duplicate team name in same event
teamSchema.index({ teamName: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Team", teamSchema);

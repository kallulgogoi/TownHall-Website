const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 5, maxlength: 100 },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    posterUrl: { type: String, required: true },
    startDateIST: { type: Date, required: true },
    endDateIST: { type: Date, required: true },
    mode: { type: String, enum: ["solo", "team"], required: true },
    maxTeamSize: { type: Number, default: 1 },
    whatsappGroupLink: { type: String },
    registrationStatus: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    requiresCodeforces: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);

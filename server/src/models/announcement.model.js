const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 10, maxLength: 50 },
    message: { type: String, required: true, minLength: 10, maxLength: 500 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("Announcement", announcementSchema);

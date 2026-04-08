const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    scholarId: { type: String, unique: true, sparse: true },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "EE", "ME", "CE", "EI"],
    },
    year: { type: Number, min: 1, max: 4 },
    phone: { type: String },
    profilePicture: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

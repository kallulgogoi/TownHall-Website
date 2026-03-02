const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const {
  googleAuth,
  getMe,
  completeOnboarding,
  updateProfile,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.put("/onboarding", protect, completeOnboarding);
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);

module.exports = router;

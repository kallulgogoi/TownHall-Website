const express = require("express");
const router = express.Router();

const announcementController = require("../controllers/announcement.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

router.get("/", announcementController.getAnnouncements);
router.post("/", protect, adminOnly, announcementController.createAnnouncement);
router.delete(
  "/:id",
  protect,
  adminOnly,
  announcementController.deleteAnnouncement,
);

module.exports = router;

const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("poster"),
  eventController.createEvent,
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("poster"),
  eventController.updateEvent,
);
router.delete("/:id", protect, adminOnly, eventController.deleteEvent);

router.put(
  "/:id/registration-status",
  protect,
  adminOnly,
  eventController.updateRegistrationStatus,
);

module.exports = router;

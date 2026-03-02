const express = require("express");
const router = express.Router();

const registrationController = require("../controllers/soloRegistration.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:eventId", protect, registrationController.registerSolo);
router.get("/my", protect, registrationController.getMyRegistrations);

module.exports = router;

const express = require("express");
const router = express.Router();

const teamController = require("../controllers/teamRegistration.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:eventId", protect, teamController.createTeam);
router.get("/my", protect, teamController.getMyTeams);
router.get("/event/:eventId", protect, teamController.getEventTeams);

module.exports = router;

const express = require("express");
const router = express.Router();
const Event = require("../models/event.model");

router.get("/daily-cleanup", async (req, res) => {
  // Ensure the request has the correct secret token
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid Cron Secret" });
  }

  try {
    // Find events where the end date has passed and they are still "open"
    const now = new Date();

    const result = await Event.updateMany(
      { endDateIST: { $lt: now }, registrationStatus: "open" },
      { $set: { registrationStatus: "closed" } },
    );

    console.log(
      `Cron executed: Closed ${result.modifiedCount} expired events.`,
    );
    res.status(200).json({
      message: "Daily cleanup successful",
      closedEventsCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    res.status(500).json({
      message: "Server error during cron execution",
      error: error.message,
    });
  }
});

module.exports = router;

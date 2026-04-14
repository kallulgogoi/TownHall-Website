require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const connectDb = require("./config/db");

// routes
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const announcementRoutes = require("./routes/announcement.routes");
const soloRegistrationRoutes = require("./routes/soloRegistration.routes");
const teamRegistrationRoutes = require("./routes/teamRegistration.routes");
const notificationRoutes = require("./routes/notification.routes");
const cronRoutes = require("./routes/cron.routes");

// Connect to database
connectDb();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/registrations/solo", soloRegistrationRoutes);
app.use("/api/registrations/team", teamRegistrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cron", cronRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File must be less than 5 MB",
      });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only JPG and PNG images are allowed") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

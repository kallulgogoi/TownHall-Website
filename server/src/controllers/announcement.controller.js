const Announcement = require("../models/announcement.model");
const { sendNotificationToAll } = require("./notification.controller");

// get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    if (title.length < 10 || title.length > 50) {
      return res.status(400).json({
        message: "Title must be between 10 and 50 characters",
      });
    }

    if (message.length < 10 || message.length > 500) {
      return res.status(400).json({
        message: "Message must be between 10 and 500 characters",
      });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      message: message.trim(),
      createdBy: req.user.id,
    });

    await sendNotificationToAll(
      `New Announcement: ${title.trim()}`,
      message.trim(),
    );

    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();

    res.json({
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid announcement ID",
    });
  }
};

// update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (title) {
      if (title.length < 10 || title.length > 50) {
        return res
          .status(400)
          .json({ message: "Title must be between 10 and 50 characters" });
      }
      announcement.title = title.trim();
    }

    if (message) {
      if (message.length < 10 || message.length > 500) {
        return res
          .status(400)
          .json({ message: "Message must be between 10 and 500 characters" });
      }
      announcement.message = message.trim();
    }

    await announcement.save();

    res.json({
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid announcement ID or Server Error" });
  }
};

const Registration = require("../models/soloRegister.model");
const Event = require("../models/event.model");
const { sendNotification } = require("../controllers/notification.controller");
exports.registerSolo = async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (event.mode !== "solo")
    return res.status(400).json({ message: "Not solo event" });

  if (event.registrationStatus !== "open")
    return res.status(400).json({ message: "Registration closed" });

  const existing = await Registration.findOne({
    user: req.user.id,
    event: event._id,
  });

  if (existing) return res.status(400).json({ message: "Already registered" });

  const registration = await Registration.create({
    user: req.user.id,
    event: event._id,
  });
  await sendNotification(
    req.user.id,
    "Registration Successful",
    `You have successfully registered for ${event.title}`,
  );
  res.status(201).json(registration);
};

exports.getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({
    user: req.user.id,
  }).populate("event");

  res.json(registrations);
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
    }).populate('user', 'name email scholarId branch phone profilePicture');;
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

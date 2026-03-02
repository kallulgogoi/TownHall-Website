const Registration = require("../models/soloRegister.model");
const Event = require("../models/event.model");

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

  res.status(201).json(registration);
};

exports.getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({
    user: req.user.id,
  }).populate("event");

  res.json(registrations);
};

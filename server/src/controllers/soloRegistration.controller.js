const Registration = require("../models/soloRegister.model");
const Event = require("../models/event.model");
const { sendNotification } = require("../controllers/notification.controller");

exports.registerSolo = async (req, res) => {
  const { codeforcesHandle } = req.body;
  const event = await Event.findById(req.params.eventId);

  if (event.mode !== "solo")
    return res.status(400).json({ message: "Not solo event" });
  if (event.registrationStatus !== "open")
    return res.status(400).json({ message: "Registration closed" });

  if (event.requiresCodeforces && !codeforcesHandle) {
    return res
      .status(400)
      .json({ message: "Codeforces handle is required for this event" });
  }

  const existing = await Registration.findOne({
    user: req.user.id,
    event: event._id,
  });
  if (existing) return res.status(400).json({ message: "Already registered" });

  // ONLY saving to the registration ticket
  const registration = await Registration.create({
    user: req.user.id,
    event: event._id,
    codeforcesHandle: event.requiresCodeforces ? codeforcesHandle : undefined,
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
  })
    .populate("event")
    .populate("user", "name scholarId email branch codeforcesHandle");

  res.json(registrations);
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
    }).populate(
      "user",
      "name email scholarId branch phone profilePicture codeforcesHandle",
    );
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

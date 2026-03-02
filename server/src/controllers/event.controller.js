const Event = require("../models/event.model");

// create event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDateIST,
      endDateIST,
      mode,
      maxTeamSize,
      whatsappGroupLink,
    } = req.body;

    if (!title || !description || !startDateIST || !endDateIST || !mode) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (title.length < 5 || title.length > 100) {
      return res
        .status(400)
        .json({ message: "Title must be 5-100 characters" });
    }

    if (description.length < 10 || description.length > 500) {
      return res
        .status(400)
        .json({ message: "Description must be 10-500 characters" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Event poster is required" });
    }

    const start = new Date(startDateIST);
    const end = new Date(endDateIST);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End date must be greater than start date" });
    }

    if (!["solo", "team"].includes(mode)) {
      return res
        .status(400)
        .json({ message: "Mode must be either 'solo' or 'team'" });
    }

    let finalTeamSize = 1;

    if (mode === "team") {
      if (!maxTeamSize || maxTeamSize < 2) {
        return res
          .status(400)
          .json({ message: "Team events must have maxTeamSize >= 2" });
      }
      finalTeamSize = Number(maxTeamSize);
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      startDateIST: start,
      endDateIST: end,
      mode,
      maxTeamSize: finalTeamSize,
      whatsappGroupLink: whatsappGroupLink || "",
      posterUrl: req.file.path,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDateIST: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

// update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      title,
      description,
      startDateIST,
      endDateIST,
      mode,
      maxTeamSize,
      whatsappGroupLink,
      registrationStatus,
    } = req.body;

    if (title) {
      if (title.length < 5 || title.length > 100) {
        return res
          .status(400)
          .json({ message: "Title must be 5-100 characters" });
      }
      event.title = title.trim();
    }

    if (description) {
      if (description.length < 10 || description.length > 500) {
        return res
          .status(400)
          .json({ message: "Description must be 10-500 characters" });
      }
      event.description = description.trim();
    }

    if (startDateIST) {
      const start = new Date(startDateIST);
      if (isNaN(start)) {
        return res.status(400).json({ message: "Invalid start date" });
      }
      event.startDateIST = start;
    }

    if (endDateIST) {
      const end = new Date(endDateIST);
      if (isNaN(end)) {
        return res.status(400).json({ message: "Invalid end date" });
      }
      event.endDateIST = end;
    }

    if (event.endDateIST <= event.startDateIST) {
      return res
        .status(400)
        .json({ message: "End date must be greater than start date" });
    }

    if (mode) {
      if (!["solo", "team"].includes(mode)) {
        return res.status(400).json({ message: "Invalid mode" });
      }
      event.mode = mode;
    }

    if (mode === "solo") {
      event.maxTeamSize = 1;
    }

    if (mode === "team" || event.mode === "team") {
      if (maxTeamSize && maxTeamSize >= 2) {
        event.maxTeamSize = Number(maxTeamSize);
      }
    }

    if (whatsappGroupLink !== undefined) {
      event.whatsappGroupLink = whatsappGroupLink;
    }

    if (registrationStatus) {
      if (!["open", "closed"].includes(registrationStatus)) {
        return res.status(400).json({ message: "Invalid registration status" });
      }
      event.registrationStatus = registrationStatus;
    }

    if (req.file) {
      event.posterUrl = req.file.path;
    }

    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

// delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

// update registration status
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationStatus } = req.body;

    if (!["open", "closed"].includes(registrationStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.registrationStatus = registrationStatus;
    await event.save();

    res.json({ message: `Registration ${registrationStatus}` });
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

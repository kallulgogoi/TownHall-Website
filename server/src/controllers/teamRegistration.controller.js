const Team = require("../models/teamRegister.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");
const { sendNotification } = require("../controllers/notification.controller");
exports.createTeam = async (req, res) => {
  try {
    const { teamName, members } = req.body; // members = array of emails

    if (!teamName || !members || !Array.isArray(members)) {
      return res.status(400).json({
        message: "Team name and member emails are required",
      });
    }

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.mode !== "team") {
      return res.status(400).json({ message: "Not team event" });
    }

    if (event.registrationStatus !== "open") {
      return res.status(400).json({ message: "Registration closed" });
    }

    if (teamName.length < 3 || teamName.length > 20) {
      return res.status(400).json({
        message: "Team name must be between 3 and 20 characters",
      });
    }

    // if (members.length > event.maxTeamSize) {
    //   return res.status(400).json({
    //     message: "Team size exceeded",
    //   });
    // }

    //Check if all emails exist in DB
    const users = await User.find({
      email: { $in: members },
    });

    if (users.length !== members.length) {
      return res.status(400).json({
        message: "All the member user must create account with us",
      });
    }

    const memberIds = users.map((user) => user._id);

    //Ensure leader is included .. If leader didn’t include their own email, system auto-adds them.
    if (!memberIds.some((id) => id.toString() === req.user.id)) {
      memberIds.push(req.user.id);
    }

    // Prevent duplicate members
    const uniqueMemberIds = [...new Set(memberIds.map((id) => id.toString()))];

    if (uniqueMemberIds.length < event.minTeamSize) {
      return res.status(400).json({
        message: `Minimum ${event.minTeamSize} members required`,
      });
    }
    if (uniqueMemberIds.length > event.maxTeamSize) {
      return res.status(400).json({
        message: "Team size exceeded",
      });
    }

    // Prevent user already in another team
    const existingTeam = await Team.findOne({
      event: event._id,
      members: { $in: uniqueMemberIds },
    });

    if (existingTeam) {
      return res.status(400).json({
        message:
          "One or more members already registered in other teams for this event",
      });
    }

    const team = await Team.create({
      teamName: teamName.trim(),
      event: event._id,
      members: uniqueMemberIds,
      teamLeader: req.user.id,
    });
    await Promise.all(
      uniqueMemberIds.map((memberId) =>
        sendNotification(
          memberId,
          "Team Registration Successful",
          `You have been added to team ${teamName.trim()} for ${event.title}`,
        ),
      ),
    );
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user.id,
    }).populate("event");

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      event: req.params.eventId,
    })
      .populate("teamLeader", "name email scholarId branch phone")
      .populate("members", "name scholarId branch");

    res.json(teams);
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

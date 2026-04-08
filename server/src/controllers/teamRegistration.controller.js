const Team = require("../models/teamRegister.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");
const { sendNotification } = require("../controllers/notification.controller");

exports.createTeam = async (req, res) => {
  try {
    const {
      teamName,
      members,
      leaderCodeforcesHandle,
      memberCodeforcesHandles,
    } = req.body;

    if (!teamName || !members || !Array.isArray(members)) {
      return res
        .status(400)
        .json({ message: "Team name and member emails are required" });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.mode !== "team")
      return res.status(400).json({ message: "Not team event" });
    if (event.registrationStatus !== "open")
      return res.status(400).json({ message: "Registration closed" });

    if (event.requiresCodeforces) {
      if (!leaderCodeforcesHandle)
        return res
          .status(400)
          .json({ message: "Leader Codeforces handle required" });
      if (
        !memberCodeforcesHandles ||
        memberCodeforcesHandles.length !== members.length
      ) {
        return res.status(400).json({
          message: "All team members must provide Codeforces handles",
        });
      }
    }

    const users = await User.find({ email: { $in: members } });

    if (users.length !== members.length) {
      return res
        .status(400)
        .json({ message: "All the member user must create account with us" });
    }

    const memberIds = users.map((user) => user._id);
    if (!memberIds.some((id) => id.toString() === req.user.id)) {
      memberIds.push(req.user.id);
    }
    // Check if any member is already registered in another team for the same event
    const uniqueMemberIds = [...new Set(memberIds.map((id) => id.toString()))];

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

    // ONLY saving to the registration ticket
    const team = await Team.create({
      teamName: teamName.trim(),
      event: event._id,
      members: uniqueMemberIds,
      teamLeader: req.user.id,
      leaderCodeforcesHandle: event.requiresCodeforces
        ? leaderCodeforcesHandle
        : undefined,
      memberCodeforcesHandles: event.requiresCodeforces
        ? memberCodeforcesHandles
        : undefined,
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
    })
      .populate("event")
      .populate("members", "name scholarId branch");

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
      .populate(
        "teamLeader",
        "name email scholarId branch phone codeforcesHandle",
      )
      .populate("members", "name scholarId branch codeforcesHandle");

    res.json(teams);
  } catch (error) {
    res.status(400).json({ message: "Invalid event ID" });
  }
};

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, profilePicture } = req.body;

    //  Allow only institute email
    if (!email.endsWith("nits.ac.in")) {
      return res.status(400).json({
        message: "Only NITS institute email is allowed",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    //  If not exists then create
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        profilePicture,
        role: "user",
        profileCompleted: false,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileCompleted: user.profileCompleted,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileCompleted: user.profileCompleted,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeOnboarding = async (req, res) => {
  try {
    const { name, scholarId, branch, year, phone, profilePicture } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileCompleted) {
      return res.status(400).json({
        message: "Onboarding already completed",
      });
    }

    if (!scholarId) {
      return res.status(400).json({
        message: "Scholar ID is required",
      });
    }

    // Update fields
    user.name = name;
    user.scholarId = scholarId;
    user.branch = branch;
    user.year = year;
    user.phone = phone;
    user.profilePicture = profilePicture || user.profilePicture;
    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      message: "Onboarding completed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, profilePicture, scholarId, year, branch } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.scholarId = scholarId || user.scholarId;
    user.branch = branch || user.branch;
    user.year = year || user.year;
    user.phone = phone || user.phone;
    if (req.file) {
      user.profilePicture = req.file.path; // Cloudinary URL
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

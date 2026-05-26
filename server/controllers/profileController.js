const User = require("../models/User");

// GET /api/profile
const getProfile = async (req, res) => {
  res.json(req.user.profile || {});
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, unit, goal, activity } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "profile.age":      age,
          "profile.gender":   gender,
          "profile.height":   height,
          "profile.weight":   weight,
          "profile.unit":     unit,
          "profile.goal":     goal,
          "profile.activity": activity,
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user.profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };

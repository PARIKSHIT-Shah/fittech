const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    // Biometric profile
    profile: {
      age:      { type: Number },
      gender:   { type: String, enum: ["male", "female", "other"] },
      height:   { type: Number }, // always stored in cm
      weight:   { type: Number }, // always stored in kg
      unit:     { type: String, enum: ["metric", "imperial"], default: "metric" },
      goal:     { type: String, enum: ["lose", "maintain", "gain", "endurance", "strength"], default: "maintain" },
      activity: { type: String, enum: ["sedentary", "light", "moderate", "active", "veryactive"], default: "moderate" },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);

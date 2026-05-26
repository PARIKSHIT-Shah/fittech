const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    tag:  {
      type: String,
      enum: ["cardio", "strength", "recovery", "nutrition", "custom"],
      default: "custom",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

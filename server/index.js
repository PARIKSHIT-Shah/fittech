const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FitTech Backend API Running"
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    time: new Date()
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/tasks", require("./routes/tasks"));

// MongoDB Connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;

  console.log("✅ MongoDB Connected");
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

module.exports = app;

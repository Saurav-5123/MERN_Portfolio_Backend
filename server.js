const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const Message = require("./models/Message");

// ✅ CORS Setup (allow Vercel frontend)
app.use(
  cors({
    origin: ["https://mern-portfolio.vercel.app"], // ← Your deployed frontend
    methods: ["GET", "POST"],
  })
);

// ✅ Body Parser
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("MERN Portfolio Backend is Live ✅");
});

// ✅ Message POST Route
app.post("/api/messages", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Incoming message:", req.body);
  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true, msg: "Message saved" });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, msg: "Error saving message" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

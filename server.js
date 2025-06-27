const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const Message = require("./models/Message");

// ✅ CORS Setup (with origin for your frontend)
app.use(cors({
  origin: "http://localhost:5174", // <-- your frontend port (Vite)
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.send("API is working!");
});

// ✅ POST route to receive messages
app.post("/api/messages", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Incoming message:", req.body); // helpful for debug
  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true, msg: "Message saved" });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, msg: "Error saving message" });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

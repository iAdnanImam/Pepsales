const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/notifications", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

const notificationSchema = new mongoose.Schema({
  userId: Number,
  message: String,
  type: String,
  status: String,
  timestamp: String
});

const Notification = mongoose.model("Notification", notificationSchema);

function sendEmail(userId, message) {
  console.log(`Email sent to user ${userId}: ${message}`);
}

function sendSMS(userId, message) {
  console.log(`SMS sent to user ${userId}: ${message}`);
}

function sendInApp(userId, message) {
  console.log(`In-App notification sent to user ${userId}: ${message}`);
}

async function sendNotificationWithRetry(notification, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending ${notification.type} notification to User ${notification.userId}`);

      const isSuccess = Math.random() > 0.3;
      if (!isSuccess) throw new Error("Simulated failure");

      switch (notification.type) {
        case 'email':
          sendEmail(notification.userId, notification.message);
          break;
        case 'sms':
          sendSMS(notification.userId, notification.message);
          break;
        case 'in-app':
          sendInApp(notification.userId, notification.message);
          break;
        default:
          throw new Error("Unsupported notification type");
      }

      console.log("Notification sent successfully!");
      return true;
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.log("All retries failed.");
        return false;
      }
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}

app.post("/notifications", async (req, res) => {
  const { userId, message, type } = req.body;

  if (!userId || !message || !type) {
    return res.status(400).json({ error: "Missing required fields: userId, message, or type." });
  }

  if (!['email', 'sms', 'in-app'].includes(type)) {
    return res.status(400).json({ error: "Invalid notification type. Must be 'email', 'sms', or 'in-app'." });
  }

  const notification = new Notification({
    userId,
    message,
    type,
    status: "pending",
    timestamp: new Date().toISOString()
  });

  await notification.save();
  const success = await sendNotificationWithRetry(notification);

  notification.status = success ? "sent" : "failed";
  await notification.save();

  res.status(201).json(notification);
});

app.get("/users/:id/notifications", async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "User ID must be a number." });
  }

  const userNotifications = await Notification.find({ userId });
  res.status(200).json(userNotifications);
});

// Start server
app.listen(PORT, () => {
  console.log(`Notification Service running at http://localhost:${PORT}`);
});

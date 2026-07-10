require("dotenv").config();          // Load .env variables

const express = require("express");
const twilio = require("twilio");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: serve static files if needed
app.use(express.static(__dirname));

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Order endpoint
app.post("/order", async (req, res) => {
  try {
    const order = req.body;

    await client.messages.create({
      body: `New Young Hustlers Order:\n${JSON.stringify(order, null, 2)}`,
      from: "+17372583742",   // your Twilio number
      to: "+13028672296"      // your phone number
    });

    res.json({ status: "success", message: "Order received and SMS sent." });
  } catch (err) {
    console.error("Twilio Error:", err);
    res.status(500).json({ status: "error", message: "SMS failed." });
  }
});

// Correct port for Render / Railway / local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

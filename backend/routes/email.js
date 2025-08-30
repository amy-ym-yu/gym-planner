import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

console.log("Testing env vars:");
console.log("TEST_VAR:", process.env.TEST_VAR);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);

// Create transporter using Gmail and App Password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err, success) => {
  if (err) console.error("Transporter verify failed:", err);
  else console.log("Transporter is ready");
});

router.post("/send-email", async (req, res) => {
  const { to, subject, html, text } = req.body;

  // Basic validation
  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    console.log("Sending email to:", to);

    // Initialize transporter here to guarantee env variables exist
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify transporter before sending
    await transporter.verify();
    console.log("Transporter verified successfully");

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // match auth.user
      to,
      subject,
      html,
      text,
    });

    console.log("Email sent successfully to", to);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});


export default router;

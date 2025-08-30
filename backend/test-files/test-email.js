import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "amy.ym.yu3@gmail.com",
      subject: "Test Email",
      text: "Hello world",
      html: "<p>Hello world</p>",
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email sending error:", err);
  }
}

sendTest();

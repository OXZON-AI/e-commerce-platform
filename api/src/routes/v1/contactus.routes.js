import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import nodemailer from 'nodemailer';
import validator from 'validator';
const router = express.Router();
// Helper function to validate Maldivian phone numbers
const isValidMaldivianPhone = (phone) => {
  const phonePattern = /^\+960\d{7}$/;
  return phonePattern.test(phone);
};
router.post("/send-email", async (req, res) => {
  try {
    const { name, email, phone, subject, inquiry } = req.body;
    // 1. Validate required fields
    if (!name || !email || !phone || !subject || !inquiry) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // 3. Validate Maldivian phone number
    if (!isValidMaldivianPhone(phone)) {
      return res.status(400).json({ error: "Invalid phone number. Please use a valid Maldivian phone number." });
    }
    // 4. Validate message length
    if (!validator.isLength(inquiry, { min: 20 })) {
      return res.status(400).json({ error: "Message must be at least 20 characters long" });
    }
    // 5. Validate subject length
    if (!validator.isLength(subject, { min: 5 })) {
      return res.status(400).json({ error: "Subject must be at least 5 characters long" });
    }
    // Ensure environment variables are set
    if (!process.env.MAILER_EMAIL || !process.env.MAILER_PASSWORD) {
      console.error("Missing email environment variables");
      return res.status(500).json({ error: "Email configuration error" });
    }
    // Email transporter configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    // Email options
    const mailOptions = {
      from: `"${name}" <${email}>`, // Properly formatted sender info
      to: process.env.MAILER_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nContact: ${phone}\n\nMessage:\n${inquiry}`,
    };
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ inquiry: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
export default router;
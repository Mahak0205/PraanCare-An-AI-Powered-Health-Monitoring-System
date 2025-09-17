const nodemailer = require("nodemailer");
const { fetchUserInfoByPatientId } = require("../services/userService");
const email = process.env.SUPPORT_EMAIL; // instead of hardcoded email


exports.sendSleepReportByEmail = async (req, res) => {
  console.log("📩 Email report route hit!", req.params);

  try {
    const { patientId } = req.params;
    console.log("✅ Step 1: patientId received:", patientId);

    if (!patientId) {
      return res.status(400).json({ message: "Missing patient ID." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No PDF attached in request." });
    }

    console.log("✅ Step 2: PDF received from frontend:", file.originalname);

    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      return res.status(500).json({ message: "SMTP credentials not configured" });
    }
    const user = await fetchUserInfoByPatientId(patientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"PraanCare Reports" <email>`,
      to: user.email,
      subject: "Your Sleep Health Report",
      text: `Hello ${user.name},\n\nAttached is your sleep report as requested.\n\nRegards,\nPraanCare Team`,
      attachments: [
        {
          filename: "sleep_health_report.pdf",
          content: file.buffer,
        },
      ],
    });

    console.log("✅ Email sent successfully:", info.messageId);
    res.status(200).json({ message: "Report emailed successfully!" });
  } catch (err) {
    console.error("❌ Failed to send email report:", err);
    res.status(500).json({ message: "Failed to send email report.", error: err.message });
  }
};

exports.sendMentalReportByEmail = async (req, res) => {
  console.log("📩 Email mental report route hit!", req.params);

  try {
    const { patientId } = req.params;
    console.log("✅ Step 1: patientId received:", patientId);

    if (!patientId) {
      return res.status(400).json({ message: "Missing patient ID." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No PDF attached in request." });
    }

    console.log("✅ Step 2: PDF received from frontend:", file.originalname);

    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      return res.status(500).json({ message: "SMTP credentials not configured" });
    }

    const user = await fetchUserInfoByPatientId(patientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"PraanCare Reports" <email>`,
      to: user.email,
      subject: "Your Mental Health Report",
      text: `Hello ${user.name},\n\nAttached is your mental health report as requested.\n\nTake care,\nPraanCare Team`,
      attachments: [
        {
          filename: "mental_health_report.pdf",
          content: file.buffer,
        },
      ],
    });

    console.log("✅ Mental Health email sent successfully:", info.messageId);
    res.status(200).json({ message: "Mental health report emailed successfully!" });
  } catch (err) {
    console.error("❌ Failed to send mental health report:", err);
    res.status(500).json({ message: "Failed to send mental health report.", error: err.message });
  }
};

exports.sendEyeReportByEmail = async (req, res) => {
  console.log("📩 Email eye report route hit!", req.params);

  try {
    const { patientId } = req.params;
    console.log("✅ Step 1: patientId received:", patientId);

    if (!patientId) {
      return res.status(400).json({ message: "Missing patient ID." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No PDF attached in request." });
    }

    console.log("✅ Step 2: PDF received from frontend:", file.originalname);

    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      return res.status(500).json({ message: "SMTP credentials not configured" });
    }

    const user = await fetchUserInfoByPatientId(patientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"PraanCare Reports" <email>`,
      to: user.email,
      subject: "Your Eye Health Report",
      text: `Hello ${user.name},\n\nAttached is your eye health report as requested.\n\nTake care,\nPraanCare Team`,
      attachments: [
        {
          filename: "eye_health_report.pdf",
          content: file.buffer,
        },
      ],
    });

    console.log("✅ Eye Health email sent successfully:", info.messageId);
    res.status(200).json({ message: "Eye health report emailed successfully!" });
  } catch (err) {
    console.error("❌ Failed to send eye health report:", err);
    res.status(500).json({ message: "Failed to send eye health report.", error: err.message });
  }
};

exports.sendCardiacReportByEmail = async (req, res) => {
  console.log("📩 Email cardiac report route hit!", req.params);

  try {
    const { patientId } = req.params;
    console.log("✅ Step 1: patientId received:", patientId);

    if (!patientId) {
      return res.status(400).json({ message: "Missing patient ID." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No PDF attached in request." });
    }

    console.log("✅ Step 2: PDF received from frontend:", file.originalname);

    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      return res.status(500).json({ message: "SMTP credentials not configured" });
    }

    const user = await fetchUserInfoByPatientId(patientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"PraanCare Reports" <email>`,
      to: user.email,
      subject: "Your Cardiac Health Report",
      text: `Hello ${user.name},\n\nAttached is your cardiac health report as requested.\n\nStay heart-healthy,\nPraanCare Team`,
      attachments: [
        {
          filename: "cardiac_health_report.pdf",
          content: file.buffer,
        },
      ],
    });

    console.log("✅ Cardiac Health email sent successfully:", info.messageId);
    res.status(200).json({ message: "Cardiac health report emailed successfully!" });
  } catch (err) {
    console.error("❌ Failed to send cardiac health report:", err);
    res.status(500).json({ message: "Failed to send cardiac health report.", error: err.message });
  }
};

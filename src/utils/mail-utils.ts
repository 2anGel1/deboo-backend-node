import nodemailer from "nodemailer";
import { SENDER_MAIL_ADDRESS, SENDER_MAIL_PASSWORD } from "../config";

interface Mail {
  subject: string;
  to: string;
  html?: string;
  attachments?: Array<Object>;
}

export const sendMail = async ({ subject, to, html, attachments }: Mail) => {
  console.log("sending mail");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_MAIL_ADDRESS,
      pass: SENDER_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: SENDER_MAIL_ADDRESS,
    to,
    subject,
    html,
    attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully");
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};

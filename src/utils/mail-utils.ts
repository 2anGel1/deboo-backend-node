// import { Resend } from "resend";
import nodemailer from "nodemailer";
import { SENDER_MAIL_ADDRESS, SENDER_MAIL_PASSWORD } from "../config";
import { Response } from 'express';


interface Mail {
  res: Response;
  response: any;
  subject: string;
  to: string;
  html?: string;
}

export const sendMail = async ({ res, response, subject, to, html }: Mail) => {
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
    to: to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log("Mail sent successfully");
    return res.status(200).json(response);
  } catch (error) {
    // console.error("Error sending mail:", error);
    return res.status(200).json({ status: false, message: "Impossible d'envoyer l'email", error: error });
  }
};

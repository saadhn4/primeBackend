import nodemailer from "nodemailer";
import config from "config";
import { text } from "express";

const user = config.get("EMAIL");
const pass = config.get("PASS");

async function sendEmail(emailData) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
    let mail = transporter.sendMail({
      from: `${user}`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });
    console.log(`Email sent.`);
  } catch (error) {
    console.log(error);
  }
}

// let obj = {
//   to: "saadcfi4@gmail.com",
//   subject: "Test for prime",
//   html: `<p>Verify pls :3</p>`,
// };

// sendEmail(obj);

export default sendEmail

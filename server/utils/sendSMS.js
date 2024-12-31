import twilio from "twilio";
import config from "config";

const sid = config.get("SID");
const token = config.get("TOKEN");
const phone = config.get("PHONE");

const client = new twilio(sid, token);

async function sendSMS(smsData) {
  try {
    await client.messages.create({
      to: smsData.to,
      body: smsData.body,
      from: phone,
    });
    console.log(`SMS sent.`);
  } catch (error) {
    console.log(error);
  }
}

// let obj = { to: "+919030358367", body: "HELLOOOOO" };

// sendSMS(obj);

export default sendSMS;

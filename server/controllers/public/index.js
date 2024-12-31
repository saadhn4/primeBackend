import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import userModel from "../../models/Users/Users.js";
import sendEmail from "../../utils/sendEmail.js";
import sendSMS from "../../utils/sendSMS.js";

const router = express.Router();
const URL = config.get("URL");

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    //checking for duplicates

    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists. Please login." });
    }

    //hashing the password

    let hashPass = await bcrypt.hash(password, 10);

    //generating tokens

    const emailToken = Math.random().toString(36).substring(2);
    const phoneToken = Math.random().toString(36).substring(2);

    //storing it in new user object

    const newUser = {
      name,
      password: hashPass,
      email,
      phone,
      userVerifyToken: {
        email: emailToken,
        phone: phoneToken,
      },
    };

    await userModel.create(newUser);

    //email verification

    // await sendEmail({
    //   to: email,
    //   subject: "Verification link",
    //   html: `<P>Verify your email by clicking the link below:</P>
    //   <a href= "${URL}/api/public/verifyemail/${emailToken}">Click Me.</a>`,
    // });

    console.log(`${URL}/api/public/verifyemail/${emailToken}`);

    //sms verification

    // await sendSMS({
    //   to: phone,
    //   body: `${URL}/api/public/verifyphone/${phoneToken}`,
    // });
    console.log(`${URL}/api/public/verifyphone/${phoneToken}`);

    //send response back

    res
      .status(200)
      .json({ msg: "User registered, please verify your phone and email!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verifyemail/:token", async (req, res) => {
  try {
    const { token } = req.params;
    let user = await userModel.findOne({ "userVerifyToken.email": token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid token." });
    }
    user.userVerify.email = true;
    user.userVerifyToken.email = null;

    await user.save(); ///IMPORTANTTTTTTTTTTTTTTTTTTTTT

    res.status(200).json({ msg: "Email verified." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verifyphone/:token", async (req, res) => {
  try {
    const { token } = req.params;
    let user = await userModel.findOne({ "userVerifyToken.phone": token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid token." });
    }
    user.userVerify.phone = true;
    user.userVerifyToken.phone = null;

    await user.save(); ///IMPORTANTTTTTTTTTTTTTTTTTTTTT

    res.status(200).json({ msg: "Phone verified." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    //check if user is actually registered

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    if (!user.userVerify.email) {
      return res.status(400).json({ msg: "Email not verified. Please do :(" });
    }

    if (!user.userVerify.phone) {
      return res
        .status(400)
        .json({ msg: "Phone number not verified. Please do :(" });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    let JWT_SECRET = config.get("JWT_SECRET");

    let token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ msg: "User logged in.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }
    const newPass = Math.random().toString(36).substring(2);
    console.log(newPass);
    let hashPass = await bcrypt.hash(newPass, 10);
    user.password = hashPass;
    await user.save(); ///IMPORTANTTTTT
    await sendEmail({
      to: email,
      subject: "Password Reset.",
      html: `<p>Your new password is: ${newPass}</p>`,
    });

    res.status(200).json({ msg: "New password sent to user's email." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;

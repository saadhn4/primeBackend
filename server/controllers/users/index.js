import express from "express";
import userModel from "../../models/Users/Users.js";

const router = express.Router();

router.get("/get/:id", async (req, res) => {
  try {
    let userParams = req.params.id;
    let user = await userModel.findOne({ _id: userParams });
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/getall", async (req, res) => {
  try {
    let users = await userModel.findOne({});
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    let userData = req.body;
    let userParams = req.params.id;
    await userModel.updateOne({ _id: userParams }, { $set: userData });
    res.status(200).json({ msg: "User updated." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let userParams = req.params.id;
    await userModel.deleteOne({ _id: userParams });
    res.status(200).json({ msg: "User deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/deleteall", async (req, res) => {
  try {
    await userModel.deleteMany({});
    res.status(200).json({ msg: "User deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;

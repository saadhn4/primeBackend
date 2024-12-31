import express from "express";
import movieModel from "../../models/Movies/Movies.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    let userData = req.body;
    await movieModel.create(userData);
    res.status(200).json({ msg: "Movie added." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    let userParams = req.params.id;
    let movie = await movieModel.findOne({ _id: userParams });
    return res.status(200).json({ movie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/getall", async (req, res) => {
  try {
    let movies = await movieModel.findOne({});
    res.status(200).json({ movies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    let userData = req.body;
    let userParams = req.params.id;
    await movieModel.updateOne({ _id: userParams }, { $set: userData });
    res.status(200).json({ msg: "Movie updated." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let userParams = req.params.id;
    await movieModel.deleteOne({ _id: userParams });
    res.status(200).json({ msg: "Movie deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/deleteall", async (req, res) => {
  try {
    await movieModel.deleteMany({});
    res.status(200).json({ msg: "All movies deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;

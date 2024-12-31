import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  url: { type: String, required: true },
});

const movieModel = mongoose.model("movies", movieSchema, "movies");

export default movieModel;

import config from "config";
import express from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  const JWT_SECRET = config.get("JWT_SECRET");
  try {
    let check = jwt.sign(token, JWT_SECRET);
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Invalid token." });
  }
};

export default authMiddleware;

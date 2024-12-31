import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unieque: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unieque: true,
    },
    userVerify: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },
    userVerifyToken: {
      email: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema, "users");
export default userModel;

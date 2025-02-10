import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.js";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      const error = new Error("ERROR:: User already exists");
      error.statusCode = 409;
      throw error;
    } else {
      const user = await User.create([{ name, email, password }], { session });
      const token = jwt.sign({ id: user[0]._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 1,
      });

      await session.commitTransaction();
      res.status(201).send({
        success: true,
        message: "POST:: User Created Successfully",
        token,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email }).select("+password");
    if (!exists) {
      const error = new Error("ERROR:: User not found");
      error.statusCode = 404;
      throw error;
    }
    const isMatch = await exists.comparePassword(password);
    if (!isMatch) {
      const error = new Error("ERROR:: Invalid Credentials");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ id: exists._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });
    res.status(200).send({
      success: true,
      message: "POST:: User Logged In Successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

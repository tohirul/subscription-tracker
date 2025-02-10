import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({
      success: true,
      message: "GET:: Users fetched successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    } else
      res.status(200).send({
        success: true,
        message: "GET:: User fetched successfully",
        user,
      });
  } catch (error) {
    next(error);
  }
};

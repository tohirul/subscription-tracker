import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import { protectRouteWithToken } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", protectRouteWithToken, getUser);

userRouter.post("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "POST:: User Created Successfully",
  });
});

userRouter.put("/:id", (req, res) => {
  res.status(200).send({
    success: true,
    message: "PUT:: User Updated Successfully",
  });
});

userRouter.delete("/:id", (req, res) => {
  res.status(200).send({
    success: true,
    message: "DELETE:: User Deleted Successfully",
  });
});

export default userRouter;

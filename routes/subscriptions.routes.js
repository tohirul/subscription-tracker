import { Router } from "express";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";
import { protectRouteWithToken } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "GET:: All Subscriptions Fetched Successfully",
  });
});

subscriptionRouter.get("/:id", (req, res) => {
  res.status(200).send({
    success: true,
    message: "GET:: Subscription details Fetched Successfully",
  });
});

subscriptionRouter.get(
  "/user/:userId",
  protectRouteWithToken,
  getUserSubscriptions
);

subscriptionRouter.post("/", protectRouteWithToken, createSubscription);

export default subscriptionRouter;

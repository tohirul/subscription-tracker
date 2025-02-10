import { SERVER_URL } from "../config/env.js";
import workflowClient from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { ObjectId } from "mongodb";
export const createSubscription = async (req, res, next) => {
  const data = req.body;
  const user = req.user;
  try {
    const subscription = await Subscription.create({
      ...data,
      user: user?._id,
    });
    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    });
    res.status(200).send({
      success: true,
      message: "POST:: Subscription Created Successfully",
      result: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = req.params.userId;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (userId && !new ObjectId(userId).equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: "ERROR:: You are not authorized to view this page",
      });
    }

    const subscriptions = await Subscription.find({ user: user._id });

    return res.status(200).json({
      success: true,
      message: "GET:: User Subscriptions successfully retrieved",
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

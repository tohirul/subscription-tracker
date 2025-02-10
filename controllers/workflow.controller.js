import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utilities/send_email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  console.log("CONTEXT", typeof context.sleepUntil);
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      subscription.renewalDate,
      "Renewal Date has passed for subscription,",
      subscriptionId,
      "Stopping workflow for said subscription."
    );
    return;
  }
  for (const daysBefore of REMINDERS) {
    console.log(
      `Sending reminder ${daysBefore} days before for subscription`,
      subscriptionId
    );
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntillReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );
    }

    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription
      );
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );
  });
};

const sleepUntillReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  if ("sleepUntill" in context) {
    await context.sleepUntill(label, date.toDate());
  } else {
    console.log("sleepUntill not available");
  }
  // await context?.sleepUntill(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label}`);
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};

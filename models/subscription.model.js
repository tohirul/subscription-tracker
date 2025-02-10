import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: [3, "Subscription name must be at least 3 characters"],
      maxLength: [100, "Subscription name must be less than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Subscription price must be greater than 0"],
      max: [1000, "Subscription price must be less than 1000"],
    },
    currency: {
      type: String,
      required: [true, "Subscription currency is required"],
      enum: [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "SEK",
        "NZD",
        "BDT",
      ],
      default: "USD",
    },
    frequency: {
      type: String,
      required: [true, "Subscription frequency is required"],
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,

      enum: [
        "sports",
        "news",
        "enterprise",
        "finance",
        "entertainment",
        "education",
        "health",
        "technology",
        "music",
        "travel",
        "food",
        "fashion",
        "fitness",
        "gaming",
        "lifestyle",
        "photography",
        "real estate",
        "automotive",
        "otheres",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit card", "debit card", "paypal", "bank transfer"],
      trim: true,
      required: true,
      default: "credit card",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Start date must be a past date",
      },
      default: new Date(),
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be after the start date",
      },
      default: function () {
        const frequency = this.frequency;
        const startDate = this.startDate;
        if (frequency === "daily") {
          return new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        } else if (frequency === "weekly") {
          return new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        } else if (frequency === "monthly") {
          return new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate()
          );
        } else if (frequency === "yearly") {
          return new Date(
            startDate.getFullYear() + 1,
            startDate.getMonth(),
            startDate.getDate()
          );
        }
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the end date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    id: {
      type: String,
      index: true,
      unique: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }
  if (this.renewalDate < this.startDate) {
    this.status = "expired";
  }
  next();
});

export default mongoose.model("Subscription", subscriptionSchema);

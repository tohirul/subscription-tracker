import express from "express";
import router from "./routes.js";
import error_middleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Subscription Tracker API",
    version: "1.0.0",
  });
});

app.use("/api", router);
app.use(error_middleware);

export default app;

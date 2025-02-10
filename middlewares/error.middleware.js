import { MongoError, MongoServerError } from "mongodb";
import { MongooseError } from "mongoose";

const error_middleware = (err, req, res, next) => {
  console.log(err);
  try {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
      const message = `Resource not found`;
      error = new Error(message);
      error.statusCode = 404;
    } else if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new Error(message);
      error.statusCode = 400;
    } else if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message);
      error.statusCode = 400;
    } else if (err instanceof MongoServerError) {
      const message = `Mongo server error: ${err.message}`;
      error = new Error(message);
      error.statusCode = 500;
    } else if (err instanceof MongoError) {
      const message = `Mongo error`;
      error = new Error(message);
      error.statusCode = 489;
    } else if (err instanceof MongooseError) {
      const message = `Mongoose error: ${err.message}`;
      error = new Error(message);
      error.statusCode = 489;
    } else if (err instanceof Error) {
      const message = `${err.message}`;
      error = new Error(message);
      error.statusCode = 489;
    } else {
      const message = `Something went wrong`;
      error = new Error(message);
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } catch (error) {
    next(error);
  }
};

export default error_middleware;

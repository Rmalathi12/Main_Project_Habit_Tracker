// Centralized error handling middleware to format all server errors consistently
const errorHandler = (err, req, res, next) => {
  // if status code is 200, change it to 500(Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  //   // Handle invalid database ID error (CastError) by returning a 404 Not Found response
  if (err.name === "CastError") {
    statusCode = 404;
    message: "Resource not found";
  }
  //   Handle MongoDB dupliocate key error(eg:trying to register an existing email )
  if (err.code === 11000) {
    statusCode = 409;
    message: "Duplicate field value entered";
  }

  //   handle mongoose validation errors(missing required fields)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Extract multiple Mongoose validation error messages and combine them into a single string eg:"Please add a habit title, Invalid frequency type"
    message: Object.values(err.errors)
      .map((val) => val.message)
      .join(",");
  }
  //   send consistent JSON error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, //show stack trace only in development mode
  });
};

module.exports = { errorHandler };

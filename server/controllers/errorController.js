const AppError = require("../utils/appError");

const handleJWTError = () => {
  return new AppError("Invalid Token ! Please login again !", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your Token has expired ! Please login again !", 401);
};

const handleDuplicateError = (err) => {
  const duplicateFields = Object.keys(err.keyPattern);

  const msg = duplicateFields
    .map(
      (el) =>
        el.charAt(0).toUpperCase() +
        el.slice(1).toLocaleLowerCase() +
        " is already used."
    )
    .join(" ");

  return new AppError(msg, 400);
};

const handleValidationError = (err) => {
  const errorKeys = Object.keys(err.errors);
  const msg =
    "Invalid Data. " + errorKeys.map((el) => err.errors[el].message).join(" ");

  return new AppError(msg, 400);
};

const handleGlobalError = (err, req, res, next) => {
  if (err.name === "ValidationError") err = handleValidationError(err);
  if (err.code == 11000) err = handleDuplicateError(err);
  if (err.name === "JsonWebTokenError") err = handleJWTError();
  if (err.name === "TokenExpiredError") err = handleJWTExpiredError();

  console.log(err);

  res.status(err.statusCode || 500).json({
    ...err,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
};

module.exports = handleGlobalError;

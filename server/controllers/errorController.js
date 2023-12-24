const AppError = require("../utils/appError");

const createCustomDuplicateError = (err) => {
  const duplicateFields = Object.keys(err.keyPattern);

  const msg = duplicateFields
    .map((el) => el.toUpperCase() + " is already used.")
    .join(" ");

  return new AppError(msg, 400);
};

const handleGlobalError = (err, req, res, next) => {
  console.log(err);
  if (err.code == 11000) err = createCustomDuplicateError(err);
  res.status(err.statusCode || 500).json({
    ...err,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
};

module.exports = handleGlobalError;

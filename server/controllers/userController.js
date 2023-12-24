const User = require("../models/userModel");
const AppError = require("../utils/appError");
const filterObject = require("../utils/filterObject");
const handlerFactory = require("./handlerFactory");

exports.setUserId = (field) => {
  return (req, res, next) => {
    if (field === "params") {
      req.params.id = req?.user?._id;
    } else {
      req[field].user = req?.user?._id;
    }
    next();
  };
};

exports.protectUpdateMe = (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route isn't for updating password.", 400));
  }
  req.body = filterObject(req.body, "profilePicture", "displayName");

  req.params.id = req.user._id;

  next();
};

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);

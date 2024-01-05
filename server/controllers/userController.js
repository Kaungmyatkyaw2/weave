const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
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
// exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const result = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followingUser",
        as: "followingUsers",
      },
    },
    {
      $lookup: {
        from: "follow",
        localField: "_id",
        foreignField: "followerUser",
        as: "followerUsers",
      },
    },
    {
      $addFields: {
        following: { $size: "$followingUsers" },
        follower: { $size: "$followerUsers" },
      },
    },
    {
      $unset: ["password", "active", "isVerifiedEmail"],
    },
  ]);

  if (result == 0) {
    return next(new AppError("No user are found with this id.", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: result[0],
    },
  });
});

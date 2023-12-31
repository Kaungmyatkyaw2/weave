const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const filterObject = require("../utils/filterObject");
const handlerFactory = require("./handlerFactory");
const Follow = require("../models/followModel");
const ApiFeatures = require("../utils/apiFeatures");

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
exports.updateUser = handlerFactory.updateOne(User);

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const query = new ApiFeatures(User.findById(id), req.query).select();

  let document = await query.query;

  const follower = await Follow.countDocuments({
    followingUser: id,
  });

  const following = await Follow.countDocuments({
    followerUser: id,
  });

  const followDoc = await Follow.findOne({
    followerUser: new mongoose.Types.ObjectId(req.user._id),
    followingUser: new mongoose.Types.ObjectId(id),
  });

  const updatedDocument = JSON.parse(JSON.stringify(document));

  res.status(200).json({
    status: "success",
    data: {
      data: {
        ...updatedDocument,
        following,
        follower,
        followId: followDoc ? followDoc._id : undefined,
      },
    },
  });
});

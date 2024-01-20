const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const filterObject = require("../utils/filterObject");
const handlerFactory = require("./handlerFactory");
const Follow = require("../models/followModel");
const ApiFeatures = require("../utils/apiFeatures");
const FollowModel = require("../models/followModel");

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
  req.body = filterObject(
    req.body,
    "profilePicture",
    "displayName",
    "userName",
    "bio"
  );

  req.params.id = req.user._id;

  next();
};

exports.getWhotoFollow = catchAsync(async (req, res, next) => {
  const initialQuery = User.find({
    $and: [
      { _id: { $ne: req.user._id } },
      {
        _id: {
          $nin: await Follow.find({ followerUser: req.user._id }).distinct(
            "followingUser"
          ),
        },
      },
    ],
  });

  const query = new ApiFeatures(initialQuery).paginate();

  const data = await query.query;

  res.status(200).json({
    status: "success",
    result: data.length,
    data: {
      data,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let document = await User.findById(id);

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

exports.getUsersBySearching = catchAsync(async (req, res, next) => {
  const search = new RegExp(req.query.search, "i");

  const query = new ApiFeatures(
    User.find({
      $or: [{ userName: search }, { displayName: search }],
    }),
    req.query
  ).paginate();

  let documents = await query.query;

  documents = await Promise.all(
    documents.map(async (doc) => {
      const follow = await FollowModel.findOne({
        followerUser: req.user._id,
        followingUser: doc.id,
      });

      return { ...JSON.parse(JSON.stringify(doc)), followId: follow?._id };
    })
  );

  res.status(200).json({
    status: "success",
    data: {
      data: documents,
    },
  });
});

exports.getAllUsers = handlerFactory.getAll(User);
exports.updateUser = handlerFactory.updateOne(User);

const Follow = require("../models/followModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

const popOpt = [{ path: "followerUser" }, { path: "followingUser" }];

const getFollow = (isGetFollower) =>
  catchAsync(async (req, res, next) => {
    const userId = req.params.userId;

    const selectField = isGetFollower ? "followingUser" : "followerUser";
    const followField = isGetFollower ? "followerUser" : "followingUser";

    const query = new ApiFeatures(
      Follow.find({ [selectField]: userId })
        .populate(popOpt[0])
        .populate(popOpt[1]),
      req.query
    ).paginate();

    let documents = await query.query;
    documents = await Promise.all(
      documents.map(async (doc) => {
        const follow = await Follow.findOne({
          followerUser: req.user._id,
          followingUser: doc[followField]._id,
        });

        const parsed = JSON.parse(JSON.stringify(doc));

        return {
          ...parsed,
          [followField]: { ...parsed[followField], followId: follow?._id },
        };
      })
    );

    res.status(200).json({
      status: "success",
      result: documents.length,
      data: {
        data: documents,
      },
    });
  });

exports.createFollow = handlerFactory.createOne(Follow, popOpt, true);
exports.getFollows = handlerFactory.getAll(Follow, popOpt);
exports.deleteFollow = handlerFactory.deleteOne(Follow);

exports.getFollowers = getFollow(true);
exports.getFollowings = getFollow(false);

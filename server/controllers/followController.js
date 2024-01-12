const Follow = require("../models/followModel");
const handlerFactory = require("./handlerFactory");

const popOpt = [{ path: "followerUser" }, { path: "followingUser" }];

exports.createFollow = handlerFactory.createOne(Follow, popOpt);
exports.getFollows = handlerFactory.getAll(Follow, popOpt);
exports.deleteFollow = handlerFactory.deleteOne(Follow);

const Follow = require("../models/followModel");
const handlerFactory = require("./handlerFactory");

exports.createFollow = handlerFactory.createOne(Follow);
exports.getFollows = handlerFactory.getAll(Follow, [
  { path: "followerUser" },
  { path: "followingUser" },
]);
exports.deleteFollow = handlerFactory.deleteOne(Follow);

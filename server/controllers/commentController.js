const Comment = require("../models/commentModel");
const handlerFactory = require("./handlerFactory");

const popOpt = [{ path: "replies" }, { path: "user" }];

exports.setUserIdAndPostId = (req, res, next) => {
  if (req.params.id) {
    req.query.post = req.params.id;
    req.body.post = req.params.id;
  }

  req.body.user = req.user._id;

  next();
};

exports.checkIsReply = (req, res, next) => {
  if (req.body.repliedComment) {
    req.body.isReply = true;
  }

  next();
};

exports.createComment = handlerFactory.createOne(Comment, popOpt);
exports.getComments = handlerFactory.getAll(Comment, popOpt, true);
exports.deleteComment = handlerFactory.deleteOne(Comment);

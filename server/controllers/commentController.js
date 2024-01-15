const Comment = require("../models/commentModel");
const handlerFactory = require("./handlerFactory");

const popOpt = [{ path: "replyedComment" }, { path: "user" }];

exports.setUserIdAndPostId = (req, res, next) => {
  if (req.params.id) {
    req.query.post = req.params.id;
    req.body.post = req.params.id;
  }

  req.body.user = req.user._id;
  next();
};
exports.createComment = handlerFactory.createOne(Comment, popOpt);
exports.getComments = handlerFactory.getAll(Comment, popOpt);
exports.deleteComment = handlerFactory.deleteOne(Comment);

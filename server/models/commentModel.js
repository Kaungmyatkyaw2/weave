const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "A comment must be related to one user !"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: [true, "A comment must be related to one post !"],
  },
  comment: {
    type: String,
    trim: true,
    required: [true, "Comment is required !"],
  },

  replyedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
  isReply: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;

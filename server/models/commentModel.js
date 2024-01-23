const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
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

    repliedComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
    isReply: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true } }
);

CommentSchema.virtual("replies", {
  ref: "comment",
  localField: "_id",
  foreignField: "repliedComment",
  options: {
    populate: "user",
  },
});

const CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;

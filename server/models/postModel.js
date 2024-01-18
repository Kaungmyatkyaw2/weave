const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "A post must be related to one user !"],
  },
  title: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  sharedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  isSharedPost: {
    type: Boolean,
  },

  privacy: {
    type: String,
    enum: ["PUBLIC", "PRIVATE"],
    default: "PRIVATE",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const PostModel = mongoose.model("post", PostSchema);

module.exports = PostModel;

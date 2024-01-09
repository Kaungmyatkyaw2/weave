const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  followingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Following user must be defined!"],
  },
  followerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Follower user must be defined!"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

FollowSchema.index({ followerUser: 1, followerUser: 1 }, { unique: true });

const FollowModel = mongoose.model("follow", FollowSchema);

module.exports = FollowModel;

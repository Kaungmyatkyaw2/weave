const Post = require("../models/postModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

const popuOpt = [
  { path: "user" },
  {
    path: "sharedPost",
    populate: {
      path: "user",
      model: "user",
    },
  },
];

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let orgQuery = Post.find({
    $or: [
      { user: req.user._id },
      {
        privacy: "PUBLIC",
      },
    ],
  });

  orgQuery = orgQuery.populate(popuOpt[0]).populate(popuOpt[1]);

  const query = new ApiFeatures(orgQuery, req.query)
    .filter()
    .select()
    .sort()
    .paginate();

  const data = await query.query;

  res.status(200).json({
    status: "success",
    result: data.length,
    data: {
      data: data,
    },
  });
});

exports.getPostsBySearching = exports.getUsersBySearching = catchAsync(
  async (req, res, next) => {
    const search = new RegExp(req.query.search, "i");

    const query = new ApiFeatures(
      Post.find({
        title: search,
        $or: [
          { user: req.user._id },
          {
            privacy: "PUBLIC",
          },
        ],
      }).populate({ path: "user" }),
      req.query
    ).paginate();

    const data = await query.query;

    res.status(200).json({
      status: "success",
      result: data.length,
      data: {
        data: data,
      },
    });
  }
);

exports.createPost = handlerFactory.createOne(Post, popuOpt);
exports.getPostById = handlerFactory.getOne(Post, popuOpt);
exports.updatePost = handlerFactory.updateOne(Post, popuOpt);
exports.deletePost = handlerFactory.deleteOne(Post);

exports.sharePost = (req, res, next) => {
  if (req.body.sharedPost) {
    req.body.isSharedPost = true;
  }

  next();
};

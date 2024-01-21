const Post = require("../models/postModel");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("../utils/cloudinary");
const handlerFactory = require("./handlerFactory");
const multer = require("multer");

const streamifier = require("streamifier");

const multerFileFilter = (req, file, cb) => {
  if (
    !file.mimetype.startsWith("image") &&
    !file.mimetype.startsWith("video")
  ) {
    cb(new AppError("Please provide valid image.", 400), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFileFilter,
});

const uploadFromBuffer = (file, imgPublicId) => {
  let confObj = {
    resource_type: file.mimetype.substr(0, 5),
  };

  if (imgPublicId) {
    confObj.public_id = imgPublicId;
  }

  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "thread",
        ...confObj,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
  });
};

exports.uploadImage = upload.single("image");

exports.uploadToCloudinary = catchAsync(async (req, res, next) => {
  if (!req.file) {
    next();
    return null;
  }

  const image = await uploadFromBuffer(req.file, req.imgPublicId);

  req.body.image = image.secure_url;
  next();
});

exports.updateImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const post = await Post.findById(req.params.id);

  if (post.image) {
    req.imgPublicId = `${post.image}`.substr(62, 20);
  }

  next();
});

exports.sharePost = (req, res, next) => {
  if (req.body.sharedPost) {
    req.body.isSharedPost = true;
  }

  next();
};

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
exports.getPostById = handlerFactory.getOne(Post);
exports.updatePost = handlerFactory.updateOne(Post, popuOpt);
exports.deletePost = handlerFactory.deleteOne(Post);

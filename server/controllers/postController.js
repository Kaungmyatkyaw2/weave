const Post = require("../models/postModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("../utils/cloudinary");
const handlerFactory = require("./handlerFactory");
const multer = require("multer");
const uuid = require("uuid").v4;

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/postImages`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${uuid()}_${Date.now()}_postImage.${ext}`);
  },
});

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
  storage: multerStorage,
  fileFilter: multerFileFilter,
});

exports.uploadImage = upload.single("image");
exports.uploadToCloudinary = catchAsync(async (req, res, next) => {
  if (!req.file) {
    next();
    return null;
  }

  let confObj = {
    resource_type: req.file.mimetype.substr(0, 5),
  };

  if (req.imgPublicId) {
    confObj.public_id = req.imgPublicId;
  }

  const image = await cloudinary.uploader.upload(req.file.path, confObj);

  req.body.image = image.secure_url;
  next();
});

exports.updateImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const post = await Post.findById(req.params.id);

  if (post.image) {
    console.log(`${post.image}`.substr(62, 20));

    req.imgPublicId = `${post.image}`.substr(62, 20);
  }

  next();
});

exports.createPost = handlerFactory.createOne(Post);
exports.getAllPosts = handlerFactory.getAll(Post, { path: "user" });
exports.getPostById = handlerFactory.getOne(Post);
exports.updatePost = handlerFactory.updateOne(Post);
exports.deletePost = handlerFactory.deleteOne(Post);

// exports.uploadImages = upload.array("images", 3);
// exports.uploadToCloudinary = catchAsync(async (req, res, next) => {
//   if (!req.files) {
//     return next();
//   }

//   const images = await Promise.all(
//     await req.files.map((file) => cloudinary.uploader.upload(file.path))
//   );

//   req.body.images = images.map((img) => img.secure_url);
//   next();
// });

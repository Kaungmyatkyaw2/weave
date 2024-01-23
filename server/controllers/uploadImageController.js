const Post = require("../models/postModel");
const User = require("../models/userModel");
const streamifier = require("streamifier");
const AppError = require("../utils/appError");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");

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

exports.uploadImage = (field) => upload.single(field);

exports.uploadToCloudinary = (field) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) {
      next();
      return null;
    }

    const image = await uploadFromBuffer(req.file, req.imgPublicId);

    req.body[field] = image.secure_url;
    next();
  });

exports.updateImage = (isPost) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const post = isPost
      ? await Post.findById(req.params.id)
      : await User.findById(req.user._id);

    if (post.image) {
      req.imgPublicId = `${post.image}`.substr(62, 20);
    }

    next();
  });

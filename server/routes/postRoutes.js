const express = require("express");
const Router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const uploadImageController = require("../controllers/uploadImageController");
const commentRouter = require("./commentRoutes");

Router.use(authController.protect);
Router.route("/")
  .get(postController.getAllPosts)
  .post(
    uploadImageController.uploadImage("image"),
    uploadImageController.uploadToCloudinary("image"),
    userController.setUserId("body"),
    postController.sharePost,
    postController.createPost
  );

Router.get("/search", postController.getPostsBySearching);

Router.route("/:id")
  .get(postController.getPostById)
  .patch(
    uploadImageController.uploadImage("image"),
    uploadImageController.updateImage(false),
    uploadImageController.uploadToCloudinary("image"),
    postController.updatePost
  )
  .delete(postController.deletePost);

Router.use(
  "/:id/comments",
  commentController.setUserIdAndPostId,
  commentRouter
);

module.exports = Router;

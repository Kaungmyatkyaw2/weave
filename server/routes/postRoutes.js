const express = require("express");
const Router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

Router.use(authController.protect);
Router.route("/")
  .get(postController.getAllPosts)
  .post(
    postController.uploadImage,
    postController.uploadToCloudinary,
    userController.setUserId("body"),
    postController.createPost
  );

Router.route("/:id")
  .get(postController.getPostById)
  .patch(
    postController.uploadImage,
    postController.updateImage,
    postController.uploadToCloudinary,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = Router;

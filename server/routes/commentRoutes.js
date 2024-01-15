const express = require("express");
const Router = express.Router({ mergeParams: true });

const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");

Router.use(authController.protect);
Router.route("/")
  .get(commentController.getComments)
  .post(commentController.createComment);

Router.route("/:id").delete(commentController.deleteComment);

module.exports = Router;

const express = require("express");
const Router = express.Router();

const authController = require("../controllers/authController");
const followController = require("../controllers/followController");

Router.use(authController.protect);
Router.route("/")
  .get(followController.getFollows)
  .post(followController.createFollow);
Router.route("/:id").delete(followController.deleteFollow);
Router.get("/followers/:userId", followController.getFollowers);
Router.get("/followings/:userId", followController.getFollowings);

module.exports = Router;

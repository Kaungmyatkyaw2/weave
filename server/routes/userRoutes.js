const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const postRouter = require("./postRoutes");

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.post(
  "/getVerificationEmail",
  authController.checkValidEmail,
  authController.getEmailVerification
);
Router.post("/verifyEmail/:token", authController.verifyEmail);

Router.post(
  "/forgotPassword",
  authController.checkValidEmail,
  authController.forgotPassword
);
Router.post("/resetPassword/:token", authController.resetPassword);

Router.use(authController.protect);
Router.patch("/updateMyPassword", authController.updateMyPassword);
Router.patch(
  "/updateMe",
  userController.protectUpdateMe,
  userController.updateUser
);
Router.get("/me", userController.setUserId("params"), userController.getUser);
Router.get("/whotofollow", userController.getWhotoFollow);
Router.get("/:id", userController.getUser);

Router.use(
  "/:id/posts",
  (req, res, next) => {
    req.query.user = req.params.id;
    next();
  },
  postRouter
);

module.exports = Router;

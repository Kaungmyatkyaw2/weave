const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

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

module.exports = Router;

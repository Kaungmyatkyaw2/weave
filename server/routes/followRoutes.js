const express = require("express");
const Router = express.Router();

const authController = require("../controllers/authController");
const followController = require("../controllers/followController");

Router.use(authController.protect);
Router.route("/").post(followController.createFollow);
Router.route("/:id").delete(followController.deleteFollow);

module.exports = Router;

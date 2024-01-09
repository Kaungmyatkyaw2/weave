const express = require("express");
const cors = require("cors");
const UserRouter = require("./routes/userRoutes");
const PostRouter = require("./routes/postRoutes");
const FollowRouter = require("./routes/followRoutes");
const handleGlobalError = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

app.use(cors());
app.options("*", cors());

app.use("/users", UserRouter);
app.use("/posts", PostRouter);
app.use("/follows", FollowRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(handleGlobalError);

module.exports = app;

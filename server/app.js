const express = require("express");
const cors = require("cors");
const UserRouter = require("./routes/userRoutes");
const PostRouter = require("./routes/postRoutes");
const FollowRouter = require("./routes/followRoutes");
const CommentRouter = require("./routes/commentRoutes");
const handleGlobalError = require("./controllers/errorController");
const AppError = require("./utils/appError");
const ratelimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const hpp = require("hpp");

const app = express();

app.enable("trust proxy");

const limiter = ratelimit({
  max: 1000,
  window: 1 * 60 * 60 * 1000,
  message: "Too many request. Try again after 1 hour !",
});

app.use(cors());
app.options("*", cors());
app.use("*", limiter);

app.use(express.json());

app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(hpp());

app.use("/users", UserRouter);
app.use("/posts", PostRouter);
app.use("/follows", FollowRouter);
app.use("/comments", CommentRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(handleGlobalError);

module.exports = app;

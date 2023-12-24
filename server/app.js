const express = require("express");
const cors = require("cors");
const UserRouter = require("./routes/userRoutes");
const PostRouter = require("./routes/postRoutes");
const handleGlobalError = require("./controllers/errorController");

const app = express();

app.use(express.json());

app.use(cors());
app.options("*", cors());

app.use("/users", UserRouter);
app.use("/posts", PostRouter);

app.use(handleGlobalError);

module.exports = app;

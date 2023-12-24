const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const app = require("./app");
const { default: mongoose } = require("mongoose");

mongoose.connect(process.env.DB_URL).then((res) => {
  console.log("Database is connected...");
});

app.listen(process.env.PORT, () => {
  console.log("Server is up on running...");
});

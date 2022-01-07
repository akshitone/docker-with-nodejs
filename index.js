const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_IP_ADDRESS,
  MONGO_PORT,
} = require("./config/config");

const postRoute = require("./routes/postRoute");

const app = express();

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP_ADDRESS}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000); // retry connection after 5 seconds
    });
};

connectWithRetry();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello, I'm Akshit Mithaiwala.</h1>");
});

app.use("/api/v1/posts", postRoute);

const port = process.env.PORT || 3000; //  if port is not set, use 3000

app.listen(port, () => {
  console.log(`listening on port... http://localhost:${port}`);
});

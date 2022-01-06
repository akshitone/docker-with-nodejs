const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_IP_ADDRESS,
  MONGO_PORT,
} = require("./config/config");

const app = express();

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP_ADDRESS}:${MONGO_PORT}/?authSource=admin`;

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("<h1>Hello, I'm Akshit Mithaiwala.</h1>");
});

const port = process.env.PORT || 3000; //  if port is not set, use 3000

app.listen(port, () => {
  console.log(`listening on port... http://localhost:${port}`);
});

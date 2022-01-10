const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_IP_ADDRESS,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRoute = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");

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

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: SESSION_SECRET,
    resave: false,
    cookie: {
      secure: false,
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
      httpOnly: true, // only allow cookies to be sent over http
      maxAge: 30000, // 30 seconds
    },
  })
);

app.use(express.json()); // for parsing application/json requests

app.get("/", (req, res) => {
  res.send("<h1>Hello, I'm Akshit Mithaiwala.</h1>");
});

app.use("/api/v1/posts", postRoute);
app.use("/api/v1/auth", authRoute);

const port = process.env.PORT || 3000; //  if port is not set, use 3000

app.listen(port, () => {
  console.log(`listening on port... http://localhost:${port}`);
});

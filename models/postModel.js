const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  body: {
    type: String,
    required: [true, "Body is required"],
  },
});

module.exports = mongoose.model("Post", postSchema);

// const Post = mongoose.model("Post", postSchema);
// module.exports = Post;

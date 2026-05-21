const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description:{
     type: String,
      required: true,
   }
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
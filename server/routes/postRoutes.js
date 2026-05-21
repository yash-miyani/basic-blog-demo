const express = require("express");
const { handleCreatePost, handleUpdatePost, handleGetAllPosts, handleDeletePost } = require("../controllers/postController");
const { restrictTo, fetchUser } = require("../middleware/auth");

const router = express.Router();

// Create Post
router.post("/", fetchUser, restrictTo(["Admin"]) ,handleCreatePost);

// Update Post
router.put("/:id",fetchUser, restrictTo(["Admin"]), handleUpdatePost);

// Delete Post
router.delete("/:id",fetchUser, restrictTo(["Admin"]), handleDeletePost);

// Get All Posts
router.get("/", handleGetAllPosts);

module.exports = router;
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

// Create Post
const handleCreatePost = catchAsync( async (req, res, next) => {
    const { title, description } = req.body;

    if (!title || !description) {
      return next(new ApiError(400, "Post title and description is required"));
    }   

    const post = await Post.create({
      title,
     description
    });

    return res
      .status(201)
      .json(new ApiResponse(200, "Blog created successfully", post));
});

// Update Post
const handleUpdatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ApiError(404, "Post not found"));
  }

  post.title = title || post.title;
  post.description = description || post.description;

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", post));
});

// Delete Post
const handleDeletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new ApiError(404, "Post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post deleted successfully"));
});

// Get All Post
const handleGetAllPosts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {

    let posts = await Post.find()
        .skip(skip)
        .limit(Number(limit))
        .exec();

    if (!posts || posts.length === 0) {
      return next(new ApiError(404, "No posts found"));
    }

    // Total records for pagination
    const totalRecords = await Post.countDocuments();

    const pages = Math.ceil(totalRecords / limit);

    const pagination = {
      current: Number(page),
      limit: Number(limit),
      next: {
        page: Number(page) < pages ? Number(page) + 1 : null,
        limit: Number(limit),
      },
      pages,
      records: totalRecords,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Posts list retrieved successfully",
          posts,
          pagination,
        ),
      );
  } catch (error) {
    next(error);
  }
});


module.exports = {
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleGetAllPosts
}
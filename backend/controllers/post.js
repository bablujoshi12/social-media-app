const Post = require("../models/Post");
const Comment = require("../models/Comment");

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

const createPost = wrapAsync(async (req, res, next) => {
  let { caption } = req.body;

  if (!req.file) {
    return next(new ExpressError(400, "Post image is required"));
  }

  const post = new Post({
    author: req.user._id,
    image: req.file.path,
    caption,
  });

  await post.save();

  return res.status(201).json({
    message: "Post created successfully",
    success: true,
    post,
  });
});

const getAllPost = wrapAsync(async (req, res, next) => {
  let posts = await Post.find()
    .populate("author", "-password")
    .populate("likes", "-password");

  return res.status(200).json({
    message: "Posts fetched successfully",
    success: true,
    posts,
  });
});

const getPost = wrapAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.postId)
    .populate("author", "-password")
    .populate("likes", "-password");

  if (!post) {
    return next(new ExpressError(404, "Post not found"));
  }

  return res.status(200).json({
    message: "Post fetched successfully",
    success: true,
    post,
  });
});

const updatePost = wrapAsync(async (req, res, next) => {
  let { caption } = req.body;
  let { postId } = req.params;

  let post = await Post.findById(postId).populate("author", "-password");

  if (!post) {
    return next(new ExpressError(404, "Post not found"));
  }

  if (req.user._id.toString() !== post.author._id.toString()) {
    return next(
      new ExpressError(403, "You are not allowed to update this post"),
    );
  }

  if (caption !== undefined) {
    post.caption = caption;
  }

  if (req.file) {
    post.image = req.file.path;
  }

  await post.save();

  return res.status(200).json({
    message: "Post updated successfully",
    success: true,
    post,
  });
});

const deletePost = wrapAsync(async (req, res, next) => {
  let { postId } = req.params;

  let post = await Post.findById(postId).populate("author", "-password");

  if (!post) {
    return next(new ExpressError(404, "Post not found"));
  }

  if (req.user._id.toString() !== post.author._id.toString()) {
    return next(
      new ExpressError(403, "You are not allowed to delete this post"),
    );
  }

  await Comment.deleteMany({ post: postId });

  await Post.deleteOne({ _id: postId });

  return res.status(200).json({
    message: "Post deleted successfully",
    success: true,
    post,
  });
});

const likePost = wrapAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ExpressError(404, "Post not found"));
  }

  const userId = req.user._id.toString();

  const isLiked = post.likes.some((likeId) => likeId.toString() === userId);

  if (isLiked) {
    post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);

    await post.save();

    await post.populate("likes", "-password");

    return res.status(200).json({
      message: "Post unliked successfully",
      success: true,
      post,
    });
  }

  post.likes.push(req.user._id);

  await post.save();

  await post.populate("likes", "-password");

  return res.status(200).json({
    message: "Post liked successfully",
    success: true,
    post,
  });
});

const createComments = wrapAsync(async (req, res, next) => {
  let { text } = req.body;
  let { postId } = req.params;

  let post = await Post.findById(postId);

  if (!post) {
    return next(new ExpressError(404, "Post not found"));
  }

  let comment = new Comment({
    text,
    author: req.user._id,
    post: postId,
  });

  await comment.save();

  return res.status(200).json({
    message: "Comment added successfully",
    success: true,
    comment,
  });
});

const getComments = wrapAsync(async (req, res, next) => {
  let { postId } = req.params;

  let comments = await Comment.find({ post: postId }).populate(
    "author",
    "-password",
  );

  if (!comments.length) {
    return next(new ExpressError(404, "No comments found"));
  }

  return res.status(200).json({
    message: "Comments fetched successfully",
    success: true,
    comments,
  });
});

const deleteComment = wrapAsync(async (req, res, next) => {
  let { commentId } = req.params;

  let comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ExpressError(404, "Comment not found"));
  }

  if (req.user._id.toString() !== comment.author.toString()) {
    return next(new ExpressError(403, "Permission denied"));
  }

  await comment.deleteOne({ _id: commentId });

  return res.status(200).json({
    message: "Comment deleted successfully",
    success: true,
    comment,
  });
});

const getUserPosts = wrapAsync(async (req, res, next) => {
  const { userId } = req.params;

  const posts = await Post.find({ author: userId })
    .populate("author", "-password")
    .populate("likes", "-password");

  return res.status(200).json({
    message: "User posts fetched successfully",
    success: true,
    posts,
  });
});

module.exports = {
  createPost,
  getAllPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  createComments,
  getComments,
  deleteComment,
  getUserPosts,
};

const express = require("express");

const router = express.Router();

const upload = require("../utils/multerConfig");

const {
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
} = require("../controllers/post");

const isAuthentication = require("../middleware/isAuthentication");

const {
  postValidation,
  commentValidation,
} = require("../middleware/postValidation");

// Create Post
router.post(
  "/",
  isAuthentication,
  upload.single("image"),
  postValidation,
  createPost,
);

// Get All Posts
router.get("/", isAuthentication, getAllPost);

// Get User Posts
router.get("/user/:userId", isAuthentication, getUserPosts);

// Get Single Post
router.get("/:postId", isAuthentication, getPost);

// Update Post
router.put(
  "/:postId",
  isAuthentication,
  upload.single("image"),
  postValidation,
  updatePost,
);

// Delete Post
router.delete("/:postId", isAuthentication, deletePost);

// Like / Unlike Post
router.post("/:postId/like", isAuthentication, likePost);

// Add Comment
router.post("/:postId/comments", isAuthentication, createComments);

// Get Comments
router.get("/:postId/comments", isAuthentication, getComments);

// Delete Comment
router.delete("/comments/:commentId", isAuthentication, deleteComment);

module.exports = router;

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/User");
const Post = require("../models/Post");

const getFeed = wrapAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  if (!currentUser) {
    return next(new ExpressError(404, "User not found"));
  }

  const followingIds = currentUser.following;

  const posts = await Post.find({
    author: { $in: followingIds },
  })
    .populate("author", "-password")
    .populate("likes", "-password");

  return res.status(200).json({
    message: "Feed fetched successfully",
    success: true,
    posts,
  });
});

module.exports = { getFeed };

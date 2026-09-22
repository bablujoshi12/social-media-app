const User = require("../models/User");

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

const followUser = wrapAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  if (req.user._id.toString() === userId.toString()) {
    return next(new ExpressError(400, "You cannot follow yourself"));
  }

  const currentUser = await User.findById(req.user._id);

  if (!currentUser) {
    return next(new ExpressError(404, "Current user not found"));
  }

  const isFollowing = currentUser.following.some(
    (followingId) => followingId.toString() === userId.toString(),
  );

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== userId.toString(),
    );

    user.followers = user.followers.filter(
      (followerId) => followerId.toString() !== req.user._id.toString(),
    );

    await currentUser.save();
    await user.save();

    return res.status(200).json({
      message: "User unfollowed successfully",
      success: true,
    });
  }

  // Follow
  currentUser.following.push(user._id);
  user.followers.push(currentUser._id);

  await currentUser.save();
  await user.save();

  return res.status(200).json({
    message: "User followed successfully",
    success: true,
  });
});

const getFollowers = wrapAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate("followers", "-password");

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  return res.status(200).json({
    message: "Followers fetched successfully",
    success: true,
    followers: user.followers,
  });
});

const getFollowing = wrapAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate("following", "-password");

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  return res.status(200).json({
    message: "Following fetched successfully",
    success: true,
    following: user.following,
  });
});

const getSearch = wrapAsync(async (req, res, next) => {
  let { username } = req.query;

  const users = await User.find({
    username: { $regex: username, $options: "i" },
  }).select("-password");

  if (!users.length) {
    return next(new ExpressError(404, "No users found"));
  }

  return res.status(200).json({
    message: "Users searched successfully",
    success: true,
    users,
  });
});

const getUserProfile = wrapAsync(async (req, res, next) => {
  let { userId } = req.params;
  let user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new ExpressError(404, "No users found"));
  }

  return res.status(200).json({
    message: "User profile fetched successfully",
    success: true,
    user,
  });
});

module.exports = {
  followUser,
  getFollowers,
  getFollowing,
  getSearch,
  getUserProfile,
};

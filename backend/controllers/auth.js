const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const ExpressError = require("../utils/ExpressError");

const wrapAsync = require("../utils/wrapAsync");

const signup = wrapAsync(async (req, res, next) => {
  let { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ExpressError(409, "User already exists"));
  }

  let hashPassword = await bcrypt.hash(password, 10);

  let createduser = new User({
    username,
    email,
    password: hashPassword,
  });

  await createduser.save();

  return res.status(201).json({
    message: "Signup successful",
    success: true,
  });
});

const login = wrapAsync(async (req, res, next) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return next(new ExpressError(401, "Invalid email or password"));
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ExpressError(401, "Invalid email or password"));
  }

  const token = jwt.sign(
    {
      email,
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24h",
    },
  );

  return res.status(200).json({
    message: "Login successful",
    success: true,
    token,
    username: user.username,
  });
});

const getProfile = wrapAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  return res.status(200).json({
    message: "Profile fetched successfully",
    user,
    success: true,
  });
});

const updateProfile = wrapAsync(async (req, res, next) => {
  const { username, bio } = req.body;

  const update = {};

  if (username !== undefined) {
    update.username = username;
  }

  if (bio !== undefined) {
    update.bio = bio;
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  return res.status(200).json({
    message: "Profile updated successfully",
    user,
    success: true,
  });
});

const updateProfileImage = wrapAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  if (!req.file) {
    return next(new ExpressError(400, "Profile image is required"));
  }

  user.profileImage = req.file.path;

  await user.save();

  return res.status(200).json({
    message: "Profile image updated successfully",
    user,
    success: true,
  });
});

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
};

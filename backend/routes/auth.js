const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/auth");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/authValidation");

const { profileValidation } = require("../middleware/profileValidation");

const upload = require("../utils/multerConfig");

const isAuthentication = require("../middleware/isAuthentication");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

router.get("/profile", isAuthentication, getProfile);

router.put("/profile", isAuthentication, profileValidation, updateProfile);

router.put(
  "/profile/image",
  isAuthentication,
  upload.single("profileImage"),
  updateProfileImage,
);

module.exports = router;

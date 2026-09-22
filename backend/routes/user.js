const express = require("express");
const router = express.Router();

const isAuthentication = require("../middleware/isauthentication");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");
const {
  followUser,
  getFollowers,
  getFollowing,
  getSearch,
  getUserProfile,
} = require("../controllers/user");

router.post("/:userId/follow", isAuthentication, followUser);

router.get("/:userId/followers", isAuthentication, getFollowers);
router.get("/:userId", isAuthentication, getUserProfile);
router.get("/:userId/following", isAuthentication, getFollowing);

router.get("/search/username", isAuthentication, getSearch);

module.exports = router;

const express = require("express");
const router = express.Router();

const isAuthentication = require("../middleware/isauthentication");
const wrapAsync = require("../utils/wrapAsync");

const { getFeed } = require("../controllers/feed");
const ExpressError = require("../utils/ExpressError");

router.get("/", isAuthentication, getFeed);

module.exports = router;

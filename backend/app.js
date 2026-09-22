const express = require("express");
const app = express();

const cors = require("cors");

const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const errorHandler = require("./middleware/errorHandler");
const ExpressError = require("./utils/ExpressError");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const feedRoutes = require("./routes/feed");

app.use("/", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/feed", feedRoutes);

app.use((req, res, next) => {
  return next(new ExpressError(404, "Page Not Found"));
});

app.use(errorHandler);

module.exports = app;

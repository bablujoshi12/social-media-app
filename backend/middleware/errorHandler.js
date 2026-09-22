const errorHandler = (err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;

  res.status(status).json({
    message,
    success: false,
  });
};

module.exports = errorHandler;

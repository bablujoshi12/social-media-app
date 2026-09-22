const Joi = require("joi");

const ExpressError = require("../utils/ExpressError");
const { text } = require("express");

const postValidation = (req, res, next) => {
  const postSchema = Joi.object({
    caption: Joi.string().max(500).allow("").optional(),
  });
  let { error } = postSchema.validate(req.body);

  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }

  next();
};

const commentValidation = (req, res, next) => {
  const commentSchema = Joi.object({
    text: Joi.string().min(1).max(1000).required(),
  });
  let { error } = commentSchema.validate(req.body);

  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }

  next();
};

module.exports = { postValidation, commentValidation };

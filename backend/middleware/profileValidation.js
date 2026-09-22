const Joi = require("joi");

const ExpressError = require("../utils/ExpressError");

const profileValidation = (req, res, next) => {
  const profileSchema = Joi.object({
    username: Joi.string().max(15).optional(),
    bio: Joi.string().max(100).optional(),
  });
  let { error } = profileSchema.validate(req.body);

  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }

  next();
};

module.exports = { profileValidation };

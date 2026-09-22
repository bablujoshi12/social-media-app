const Joi = require("joi");

const ExpressError = require("../utils/ExpressError");

const signupValidation = (req, res, next) => {
  const signupSchema = Joi.object({
    username: Joi.string().min(7).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      .required(),
  });
  let { error } = signupSchema.validate(req.body);

  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }

  next();
};

const loginValidation = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      .required(),
  });
  let { error } = loginSchema.validate(req.body);

  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }

  next();
};

module.exports = { signupValidation, loginValidation };

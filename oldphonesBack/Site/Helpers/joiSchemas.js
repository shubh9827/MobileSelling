const Joi = require('joi');
const userRegisterSchema = Joi.object({
    name : Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    gender: Joi.string().valid('male', 'female', 'other').insensitive().required(),
    dob :  Joi.date().max('now').required(),
    password: Joi.string()
             .min(8)
             .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/))
             .required()
             .messages({
                'string.base': 'Password must be a string.',
                'string.empty': 'Password is required.',
                'string.min': 'Password must be at least 8 characters long.',
                'any.required': 'Password is required.',
                'string.pattern.base': 'password must contain Minimum eight characters, at least one letter, one number and one special character:'
              }),
    confirmPassword : Joi.string()
});

const addProductSchema = Joi.object({
    Brand: Joi.string().required(),
    ModelName: Joi.string().required(),
    Storage: Joi.string().required(),
    RAM: Joi.string().required(),
    Price: Joi.number().required(),
    Network: Joi.string().required(),
    Condition: Joi.string().required(),
    Features: Joi.string().required(),
});

module.exports = {
    userRegisterSchema,
    addProductSchema
}
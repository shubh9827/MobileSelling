const authController = require('../Controllers/AuthController');
const {userRegisterSchema} = require('../Helpers/joiSchemas');
const validateData = require('../Middlewares/validateData');
const passport = require('../Helpers/Passport');
module.exports = (app) => {
  app.post('/signup', validateData(userRegisterSchema), authController.signup);
  app.post('/login', authController.login);
  app.post('/oauth', authController.oAuthRedirect);
}

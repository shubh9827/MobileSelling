"use strict"
const Auth = require('./AuthRoutes');
const Product  = require('./ProductRoutes');
const User = require('./UserRoutes')
module.exports = {
  Auth : Auth,
  Product : Product,
  User : User
}
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const secretKey = process.env.SECRET_KEY
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, secretKey, (err, authData) => {
      if (err) {
        res.status(403).send({msg : "error in token verification"});
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};
module.exports = verifyToken;
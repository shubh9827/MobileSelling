const express = require('express');
const app = express();
const joi = require('joi');
const path =  require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const port = 2000;
const routes = require('./Site/Routes');
const cors = require('cors');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieparser());
app.use(bodyParser.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));
function traverseObject(obj) {
  for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverseObject(obj[key]);
      } else {
        console.log(`${key}: ${obj[key](app)}`);
      }
    }
  }
traverseObject(routes);
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 

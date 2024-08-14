const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    googleId : {
      type : String
    },
    name : {
        type : String
    },
    email : {
       type : String
    },
    phone : { 
      type : String
    },
    gender : {
        type : String,
    },
    dob : {
        type : Date
    },
    password : {
        type : String
    },
    address : {
      name : String,
      phone : String,
      pinCode : String,
      locality : String,
      district : String,
      state : String,
      addressStreet : String
    }
   },
  {
     timestamps : true,
  });
module.exports = mongoose.model('Users', UserSchema);
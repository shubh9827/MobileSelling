const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    brand : {
        type : String
    },
    network : {
        type :  String
    },
    modelName : {
        type : String
    },
    storage : {
        type : String
    },
    ram : {
        type : String
    },
    features : {
        type : String
    },
    price : {
        type : Number
    },
    condition : {
        type :  String
    }, 
    images : {
        type :  [String]
     }
},
{
    timestamps : true
});
module.exports = mongoose.model('Products', ProductSchema);
const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    productIds : [mongoose.Schema.Types.ObjectId]
});
module.exports =  mongoose.model("Cart", CartSchema);
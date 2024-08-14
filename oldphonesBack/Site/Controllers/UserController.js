const {
    models : {
      Users,
      Cart,
      Products
    }
  } = require('../Models');
  const mongoose = require('mongoose');
  
  exports.checkAddress = async (req, res) => {
    try {
      console.log(JSON.stringify(req.authData) + "LLLLLLLllll")
      const userEmail = req.authData.email;
      const user = await Users.findOne({
        email : userEmail,
        address : {$exists : true}
      });
      if(user){
          res.status(200).send({address : user.address})
      }
      else res.status(404).send({msg : "no address added yet"});
    }
    catch(error) {
      res.status(500).send(error.message)
    }
}

exports.addAddress = async(req, res) => {
  try {
    const userAddress = {
      name : req.body.name,
      phone : req.body.phone,
      pinCode : req.body.pinCode,
      locality : req.body.locality,
      district : req.body.district,
      state : req.body.state,
      addressStreet : req.body.addressStreet
    };
    const userEmail = req.authData.email ? req.authData.email : req.authData.user.email ? req.authData.user.email : "";
    if (!userEmail) {
      res.status(400).send({ message: "User email not found in auth data" });
      return;
    }
    const update = { "address": userAddress };
    const user = await Users.findOneAndUpdate(
      { email: userEmail }, 
      { $set: update },
      { new: true }
    );
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    res.status(200).send({ message: "Address updated successfully", user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addToCart = async(req, res) => {
  try {
    const email = req.authData.email;
    query = {
      _id : req.authData._id
    }
    let cartDoc = await Cart.findOne(query);
    if(cartDoc) {
      cartDoc._id = req.authData._id;
      if (!cartDoc.productIds.includes(req.body.productId)) {
        cartDoc.productIds.push(req.body.productId);
      }
    }
    else {
      cartDoc = new Cart({
        _id: req.authData._id,
        productIds: [req.body.productId]
      })
    }
    cartDoc.save();
    res.status(200).send(cartDoc)
  }
  catch(error){
    res.status(500).send({ message : error.message })
  }
}

exports.getCartProducts = async(req, res) => {
  try {
    const _id = req.authData._id;
    const userCart = await Cart.findOne({_id : _id});
    const objectIds =  userCart.productIds.map(id => new mongoose.Types.ObjectId(id));
    const query = { _id: { $in: objectIds } };
    const result = await Products.aggregate([
      { $match: query },
      {
        $group : {
          _id : null,
          totalPrice : { $sum :"$price"},
          products : { $push : "$$ROOT" }
        }
      },
      {
        $project : {
          _id : 0,
          totalPrice : 1,
          products : 1
        }
      }
    ]);
    res.status(200).send(result);
  }
  catch(err){
    res.status(500).send({message : err.message})
  }
}

exports.deleteCartProduct = async(req, res) => {
  try {
    const id = req.authData._id;
    const newCart = await Cart.findOneAndUpdate({_id : id}, {$pull : { productIds : req.body._id}}, {new  : true})
    const objectIds =  newCart.productIds.map(id => new mongoose.Types.ObjectId(id));
    const query = { _id: { $in: objectIds } };
    const result = await Products.aggregate([
      { $match: query },
      {
        $group : {
          _id : null,
          totalPrice : { $sum :"$price"},
          products : { $push : "$$ROOT" }
        }
      },
      {
        $project : {
          _id : 0,
          totalPrice : 1,
          products : 1
        }
      }
    ]);
    res.status(200).send(result);
  }
  catch(error) {
    res.status(500).send({message : error.message})
  }
}

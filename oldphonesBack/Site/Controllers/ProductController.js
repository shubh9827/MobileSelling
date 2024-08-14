const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  models : {
    Products
  }
} = require('../Models');
exports.addProduct = async (req, res) => {
  try {
      const imageFileNames = req.validatedFiles.map(file => file.originalname);
      const newProduct = {
        brand: req.validatedBody.Brand,
        modelName: req.validatedBody.ModelName,
        storage: req.validatedBody.Storage,
        ram: req.validatedBody.RAM,
        price: req.validatedBody.Price,
        network: req.validatedBody.Network,
        condition: req.validatedBody.Condition,
        features: req.validatedBody.Features,
        images: imageFileNames
      };
      const productIsAvail = await Products.findOne({images : {$in : newProduct.images}});
      if(productIsAvail){
        res.status(409).send({error : "Product already exists with same images"});
        return
      }
      const product = new Products(newProduct);
      await product.save();
      res.status(201).send({ msg : 'Product added successfully!' });
    } catch (saveError) {
      res.status(500).send({ error: 'An error occurred while saving the product.' });
    }
};
exports.getProducts = async (req, res) => {
  try {
    const query = {};
    const { brandName, network, price, limit = 5, page = 1 } = req.query;
    if (brandName) query["brandName"] = brandName;
    if (network) query["network"] = network;
    if (price) query["price"] = price;

    const products = await Products.find(query)
                                   .skip((page - 1) * limit)
                                   .limit(parseInt(limit));

    res.status(200).send({
      products
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

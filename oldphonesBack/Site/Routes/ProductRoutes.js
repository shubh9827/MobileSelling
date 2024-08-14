const ProductController = require('../Controllers/ProductController');
const {addProductSchema} = require('../Helpers/joiSchemas');
const validateData = require('../Middlewares/validateData');
const verifyToken = require('../Middlewares/VerifyToken');

module.exports = (app) => {
    app.post('/addProduct', validateData(addProductSchema), ProductController.addProduct);
    app.get('/getProducts', ProductController.getProducts);
}
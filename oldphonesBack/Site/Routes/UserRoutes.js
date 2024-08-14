const userController = require('../Controllers/UserController');
const {addProductSchema} = require('../Helpers/joiSchemas');
const verifyToken = require('../Middlewares/VerifyToken');

module.exports = (app) => {
    app.get('/checkAddress', verifyToken, userController.checkAddress);
    app.put('/addAddress', verifyToken, userController.addAddress);
    app.post('/addToCart', verifyToken, userController.addToCart);
    app.get('/getCartProducts', verifyToken, userController.getCartProducts);
    app.delete('/deleteCartProduct', verifyToken, userController.deleteCartProduct);
}
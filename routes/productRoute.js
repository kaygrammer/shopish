const express = require("express");
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

const {createProduct, 
    getAProduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct,
    addToWishList,
    rating} = require("../controller/productController")
const router = express.Router();

router.post('/', createProduct);
router.get('/product/:id',authmiddleware, isAdmin, getAProduct);
router.get('/products',authmiddleware, isAdmin, getAllProduct);
router.put('/products/:id',authmiddleware, isAdmin, updateProduct);
router.delete('/products/:id',authmiddleware, isAdmin, deleteProduct);
router.put('/wishlist', authmiddleware, addToWishList);
router.put('/rating', authmiddleware, rating);

module.exports = router
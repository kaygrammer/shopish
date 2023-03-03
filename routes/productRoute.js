const express = require("express");
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

const {createProduct, 
    getAProduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct} = require("../controller/productController")
const router = express.Router();

router.post('/', createProduct);
router.get('/product/:id',authmiddleware, isAdmin, getAProduct);
router.get('/products',authmiddleware, isAdmin, getAllProduct);
router.put('/products/:id',authmiddleware, isAdmin, updateProduct);
router.delete('/products/:id',authmiddleware, isAdmin, deleteProduct);


module.exports = router
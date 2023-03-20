const express = require("express")
const {createProductCategory, updateProductCategory, deleteProductCategory, getsingleCategory, getCategory} = require("../controller/productCategoryController")
const router = express.Router()
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

router.post("/", createProductCategory);
router.put("/:id", updateProductCategory);
router.delete("/:id", deleteProductCategory);
router.get("/:id", getsingleCategory);
router.get("/", getCategory);



module.exports = router;

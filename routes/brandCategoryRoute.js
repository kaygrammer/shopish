const express = require("express")
const {createProductBrand, updateProductBrand, deleteProductBrand, getsingleBrand, getBrand} = require("../controller/brandController")
const router = express.Router()
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

router.post("/", createProductBrand);
router.put("/:id", updateProductBrand);
router.delete("/:id", deleteProductBrand);
router.get("/:id", getsingleBrand);
router.get("/", getBrand);



module.exports = router;

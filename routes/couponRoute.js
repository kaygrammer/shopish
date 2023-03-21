const express = require("express");
const { createCoupon, getAllCoupon, updateACoupon, deleteACoupon } = require("../controller/couponController");
const router = express.Router();
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")


router.post('/', authmiddleware, isAdmin, createCoupon);
router.get('/', authmiddleware, isAdmin, getAllCoupon);
router.put('/:id', authmiddleware, isAdmin, updateACoupon);
router.put('/:id', authmiddleware, isAdmin, deleteACoupon);

module.exports = router;
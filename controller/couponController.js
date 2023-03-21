const Coupon = require("../models/couponModel")
const validateMongoDbId = require("../utils/validateMongodbid")
const asyncHandler = require("express-async-handler")


const createCoupon = asyncHandler(async (req, res)=>{
    try{
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    }catch(error){
        res.status(500).json(error);
    }
})


const getAllCoupon = asyncHandler(async (req, res)=>{
    try{
        const coupons = await Coupon.find()
        res.json(coupons)
    }catch(error){
        res.status(500).json(error);
    }
})

const updateACoupon = asyncHandler(async (req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const updatecoupons = await Coupon.findByIdAndUpdate(id, req.body, 
            {new:true})
        res.json(updatecoupons)
    }catch(error){
        res.status(500).json(error);
    }
})

const deleteACoupon = asyncHandler(async (req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const deletecoupon = await Coupon.findByIdAndDelete(id)
        res.json(deletecoupon)
    }catch(error){
        res.status(500).json(error);
    }
})


module.exports = {createCoupon, getAllCoupon, updateACoupon, deleteACoupon}
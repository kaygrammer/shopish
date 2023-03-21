const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbid")

0
const createProductBrand =  asyncHandler(async(req, res)=>{
    try{
    const newBrand = await Brand.create(req.body);
    res.status(200).json(newBrand)
}catch(error){
    res.status(500).json(error);
}
})

const updateProductBrand =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, 
        {new:true});
    res.status(200).json(updateBrand)
}catch(error){
    res.status(500).json(error);
}
})

const deleteProductBrand =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.status(200).json("product deleted successfully")
}catch(error){
    res.status(500).json(error);
}
})

const getsingleBrand =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const getsingleBrand = await Brand.findById(id)
    res.status(200).json(getsingleBrand)
}catch(error){
    res.status(500).json(error);
}
})

const getBrand =  asyncHandler(async(req, res)=>{
    try{
    const getBrand = await Brand.find()
    res.status(200).json(getBrand)
}catch(error){
    res.status(500).json(error);
}
})

module.exports = {createProductBrand, updateProductBrand, deleteProductBrand, getsingleBrand, getBrand}
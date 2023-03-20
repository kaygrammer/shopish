const Category = require("../models/productCategoryModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbid")


const createProductCategory =  asyncHandler(async(req, res)=>{
    try{
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory)
}catch(error){
    res.status(500).json(error);
}
})

const updateProductCategory =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, 
        {new:true});
    res.status(200).json(updateCategory)
}catch(error){
    res.status(500).json(error);
}
})


const deleteProductCategory =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.status(200).json("product deleted successfully")
}catch(error){
    res.status(500).json(error);
}
})

const getsingleCategory =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const getsinglecategory = await Category.findById(id)
    res.status(200).json(getsinglecategory)
}catch(error){
    res.status(500).json(error);
}
})

const getCategory =  asyncHandler(async(req, res)=>{
    try{
    const getcategory = await Category.find()
    res.status(200).json(getcategory)
}catch(error){
    res.status(500).json(error);
}
})

module.exports = {createProductCategory, updateProductCategory, deleteProductCategory, getsingleCategory, getCategory}
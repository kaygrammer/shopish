const Blog = require("../models/blogCategoryModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbid")


const createBlogCategory =  asyncHandler(async(req, res)=>{
    try{
    const newBlog = await Blog.create(req.body);
    res.status(200).json(newBlog)
}catch(error){
    res.status(500).json(error);
}
})

const updateBlogCategory =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const updateCategory = await Blog.findByIdAndUpdate(id, req.body, 
        {new:true});
    res.status(200).json(updateCategory)
}catch(error){
    res.status(500).json(error);
}
})


const deleteBlogCategory =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const deleteCategory = await Blog.findByIdAndDelete(id);
    res.status(200).json("product deleted successfully")
}catch(error){
    res.status(500).json(error);
}
})

const getsingleCategory =  asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
    const getsinglecategory = await Blog.findById(id)
    res.status(200).json(getsinglecategory)
}catch(error){
    res.status(500).json(error);
}
})

const getCategory =  asyncHandler(async(req, res)=>{
    try{
    const getcategory = await Blog.find()
    res.status(200).json(getcategory)
}catch(error){
    res.status(500).json(error);
}
})

module.exports = {createBlogCategory, updateBlogCategory, deleteBlogCategory, getsingleCategory, getCategory}
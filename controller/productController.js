const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler")
const slugify = require("slugify");


const createProduct = asyncHandler(async(req, res)=>{
    try{
        if (req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body)
        res.status(200).json({
            success:true,
            message:"new product created successfully",
            newProduct
        })

    }catch(error){
        res.status(500).json(error);
    }
})

const getAProduct = asyncHandler(async(req, res)=>{
    try{
    const {id} = req.params
    const getAproduct = await Product.findById(id)
    if(!getAproduct){
        return res.status(400).json({
            success:true,
            message:`product with ${id} not found`
        })
    }
    return res.status(200).json({
        success:true,
        getAproduct
    })}catch(error){
        res.status(500).json(error);
    }
})

const getAllProduct = asyncHandler(async(req, res)=>{
    try{
        const queryObj = {...req.query};
        
        // filtering 
        const excludefields = ['page', 'sort', 'limit', 'fields'];
        excludefields.forEach((el)=> delete queryObj[el])
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = Product.find(JSON.parse(queryStr))
        
        //sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)
        }else{
            query =query.sort('-createdAt')
        }

        //limiting the fields
        if (req.query.fields){
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        }else{
            query = query.select('-__v')
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit
        const skip = (page - 1)* limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error("this page does not exist")
        }

        const allProduct = await query
        if(allProduct == ""){
            return res.status(200).json({
                success:true,
                message:"no product available in db"
            })    
        }
        return res.status(200).json({
            success:true,
            allProduct
        })

    }catch(error){
        res.status(500).json(error);
    }
})

const updateProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params
    try{
        if (req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate(id, 
            req.body, 
            {new:true})
            return res.status(200).json({
                success:true,
                message:`product with ${id} was updated successfully`,
                updateProduct
            })
    }catch(error){

    }
})


const deleteProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params
    try{
        const deleteProduct = await Product.findByIdAndDelete(id)
            return res.status(200).json({
                success:true,
                message:`product with ${id} was deleted successfully`,
                
            })
    }catch(error){

    }
})




module.exports = {createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct};
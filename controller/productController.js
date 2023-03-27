const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler")
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbid");
const cloudinaryuploading = require("../utils/cloudinary")

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
        res.status(500).json(error);
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
        res.status(500).json(error);
    }
})

const addToWishList = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {prodId} = req.body;
    try{
        const user = await User.findById(_id)
        const alreadyadded = user.wishList.find((id) => id.toString() === prodId)
        if(alreadyadded){
            let user =await User.findByIdAndUpdate(_id,
                {
                $pull: {wishList: prodId}
            },
            {new:true})
            res.json(user)
        }
        else{
            let user =await User.findByIdAndUpdate(_id, 
            {
                $push: {wishList: prodId}
            }, {new:true})
            res.json(user)
        }
    }catch(error){
        res.status(500).json(error);
    }
})
  

const rating = asyncHandler(async(req, res)=>{
    const {_id} = req.user
    const {star, prodId, comment} = req.body
    try{
    const product = await Product.findById(prodId)
    let alreadyRated = product.ratings.find((userId)=> userId.postedBy.toString() === _id.toString())
    if(alreadyRated){
        const updateRating = await Product.updateOne({
            ratings: {$elemMatch: alreadyRated},
            },
            {$set:{"ratings.$.star":star, "ratings.$.comment":comment},
        },
        {new:true
        }
        )
    }else{
        const rateProduct = await Product.findByIdAndUpdate(prodId,
            {
                $push:{
                    ratings:{
                        star:star,
                        comment:comment,
                        postedBy:_id
                    }
                }
            })
    }
    const getAllRatings = await Product.findById(prodId);
    let totalrating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings.map((item)=> item.star).reduce((prev, curr)=> prev + curr, 0);
    let averageRating = Math.round(ratingSum / totalrating);
    let products = await Product.findByIdAndUpdate(prodId, {
        totalrating: averageRating
    }, {new:true})
    res.json(products)    
    }catch(error){
        res.status(500).json(error);
    }
})


const uploadImages = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const uploader = (path)=> cloudinaryuploading(path, "images");
        const urls = [];
        const files = req.files
        for (const file of files){
            const {path}= file;
            const newPath = await uploader(path);
            urls.push(newPath);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {images: urls.map((file)=>{
            return file;
        })}, {new:true})
        res.json(findProduct)  
    }
    catch(error){
        res.status(500).json(error);

    }
})




module.exports = {createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages};


// const { isValidObjectId } = require('mongoose');

// const ratings = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { star, prodId } = req.body;

//   // Input validation
//   if (!isValidObjectId(prodId)) {
//     return res.status(400).json({ message: 'Invalid product ID' });
//   }
//   if (typeof star !== 'number' || star < 1 || star > 5) {
//     return res.status(400).json({ message: 'Invalid star rating' });
//   }

//   try {
//     const product = await findProduct(prodId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     let alreadyRated = hasUserRated(product.ratings, _id);
//     if (alreadyRated) {
//       const updateRating = await updateExistingRating(product.ratings, alreadyRated, star);
//       res.json(updateRating);
//     } else {
//       const rateProduct = await addNewRating(prodId, star, _id);
//       res.json(rateProduct);
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// async function findProduct(prodId) {
//   return await Product.findById(prodId);
// }

// function hasUserRated(ratings, userId) {
//   return ratings.find((rating) => rating.postedBy.toString() === userId.toString());
// }

// async function updateExistingRating(ratings, alreadyRated, star) {
//   return await Product.updateOne(
//     { ratings: { $elemMatch: alreadyRated } },
//     { $set: { "ratings.$.star": star } },
//     { new: true }
//   );
// }

// async function addNewRating(prodId, star, userId) {
//   return await Product.findByIdAndUpdate(
//     prodId,
//     {
//       $push: {
//         ratings: {
//           star,
//           postedBy: userId,
//         },
//       },
//     },
//     { new: true }
//   );
// }
const Blog = require("../models/blogModel")
const User = require("../controller/user")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbid")


const createBlog = asyncHandler(async (req, res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.status(200).json(newBlog);

    }catch(error){
        res.status(500).json(error);
    }
})

const updateBlog = asyncHandler(async (req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new:true
        });
        res.status(200).json(updateBlog);

    }catch(error){
        res.status(500).json(error);
    }
})

const fetchSingleBlog = asyncHandler(async (req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const blog = await Blog.findById(id).populate("likes").populate("disLikes")
        const updatedBlog = await Blog.findByIdAndUpdate(id, {
            $inc:{numView:1} 
        }, {new:true});
        res.status(200).json({blog});
    }catch(error){
        res.status(500).json(error);
    }
})

const fetchBlog = asyncHandler(async (req, res)=>{
    try{
        const blog = await Blog.find();
        res.status(200).json({"success":true, blog});

   }catch(error){
        res.status(500).json(error);
    }
})


const deleteBlog = asyncHandler(async (req, res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const blog = await Blog.findByIdAndDelete(id);
        res.status(200).json({"success":true, "message":"blog deleted successfully"});

   }catch(error){
        res.status(500).json(error);
    }
})


const likeBlog = asyncHandler(async (req, res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId)
    try{
    //Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the logined user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.disLikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
    ;
    if (alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {disLikes: loginUserId},
                isDisLiked: false,
            },
            {
                new:true
            }
        );
        res.json(blog)
    }
    if (isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            {
                new:true
            }
        );
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {likes: loginUserId},
                isLiked: true
            },
            {new: true}
        )
        res.json(blog)
    }}catch(error){
        res.status(500).json(error);
    }
})

const dislikeBlog = asyncHandler(async (req, res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId)
    try{
    //Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId);
    // find the logined user
    const loginUserId = req?.user?._id;
    // find if the user has disliked the blog
    const isDisliked = blog?.isDisLiked;
    // find if the user has liked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
    ;
    if (alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            {
                new:true
            }
        );
        res.json(blog)
    }
    if (isDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {disLikes: loginUserId},
                isDisLiked: false,
            },
            {
                new:true
            }
        );
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {disLikes: loginUserId},
                isDisLiked: true
            },
            {new: true}
        )
        res.json(blog)
    }}catch(error){
        res.status(500).json(error);
    }
})


module.exports = {createBlog, updateBlog, fetchBlog, fetchSingleBlog, deleteBlog, likeBlog, dislikeBlog};
const express = require("express")
const {createBlog, updateBlog, fetchBlog, fetchSingleBlog, deleteBlog, likeBlog, dislikeBlog, uploadBlogImages} = require("../controller/blogController")
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const router = express.Router()

router.post('/', createBlog);

router.put('/upload/:id', 
authmiddleware,
isAdmin,
uploadPhoto.array('images', 10),
blogImgResize,
uploadBlogImages
);

router.put('/update/:id', updateBlog);
router.get('/', fetchBlog);
router.get('/single-blog/:id', fetchSingleBlog);
router.delete('/delete/:id', deleteBlog);
router.put('/likes', authmiddleware, likeBlog);
router.put('/dislikes', authmiddleware, dislikeBlog);

module.exports = router;
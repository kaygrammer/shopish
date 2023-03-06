const express = require("express")
const {createBlog, updateBlog, fetchBlog, fetchSingleBlog, deleteBlog, likeBlog} = require("../controller/blogController")
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")
const router = express.Router()

router.post('/', createBlog);
router.put('/update/:id', updateBlog);
router.get('/', fetchBlog);
router.get('/single-blog/:id', fetchSingleBlog);
router.delete('/delete/:id', deleteBlog);
router.put('/likes', authmiddleware, likeBlog);

module.exports = router;
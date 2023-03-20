const express = require("express")
const {createBlogCategory, updateBlogCategory, deleteBlogCategory, getsingleCategory, getCategory} = require("../controller/blogCategoryController")
const router = express.Router()
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

router.post("/", createBlogCategory);
router.put("/:id", updateBlogCategory);
router.delete("/:id", deleteBlogCategory);
router.get("/:id", getsingleCategory);
router.get("/", getCategory);



module.exports = router;

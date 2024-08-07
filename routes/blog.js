const express = require("express");
const blogController = require("../controllers/blog.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// Route to create a blog post, accessible to authenticated users
router.post("/createBlog", verify, blogController.createBlogPost);

// Route to edit a blog post, accessible to authenticated users
router.patch("/editBlog/:blogId", verify, blogController.editBlogPost);

// Route to delete a blog post
router.delete("/deleteBlog/:blogId", verify, blogController.deleteBlog);

// Route to get all blog posts
router.get("/blogs", blogController.getAllBlogs);

// Route to get a single blog post by ID
router.get("/getABlog/:blogId", blogController.getBlogById);

// Route to create a comment on a blog post
router.post("/addComment/:blogId", verify, blogController.createComment);

// Route to get comments for a specific blog post
router.get("/getComments/:blogId", blogController.getComments);

// Route to delete comments on a specific blog post
router.delete("/deleteBlogComments/:blogId", verify, verifyAdmin, blogController.deleteAllComments);


module.exports = router;
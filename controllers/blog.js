const Blog = require("../models/Blog.js");
const { errorHandler } = require("../auth");


// Controller method to create a new blog post
module.exports.createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; 

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const existingPost = await Blog.findOne({ title });
    if (existingPost) {
      return res.status(400).json({ message: "A blog post with this title already exists" });
    }

    const newBlogPost = new Blog({
      title,
      content,
      author: userId, 
    });

    const savedBlogPost = await newBlogPost.save();

    res.status(201).json({
      message: "Blog post created successfully",
      blogPost: savedBlogPost,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};


// Controller method to edit a blog post
module.exports.editBlogPost = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content } = req.body;
    const { user } = req;

    const blogPost = await Blog.findById(blogId);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const blogPostAuthorId = blogPost.author.toString(); 
    const currentUserId = user.id.toString();

    if (blogPostAuthorId !== currentUserId) {
      return res.status(403).json({ message: "Only the author is authorized to edit their blog post." });
    }

    blogPost.title = title || blogPost.title;
    blogPost.content = content || blogPost.content;

    const updatedBlogPost = await blogPost.save();

    res.status(200).json({
      message: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};


module.exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const  userId  = req.user.id;
    const userIsAdmin = req.user.isAdmin; 

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== userId && !userIsAdmin) {
      return res.status(403).json({ message: "Only the author and admin are authorized to delete a blog" });
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getAllBlogs = (req, res) => {
  Blog.find({})
    .populate('author', 'userName') // Populate author field with the userName
    .then(result => {
      if (result.length > 0) {
        // Transform the result to include author's username
        const transformedResult = result.map(blog => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          createdOn: blog.createdOn,
          author: blog.author.userName, // Include author's username
          comments: blog.comments
        }));

        return res.status(200).send(transformedResult);
      } else {
        return res.status(404).send({ message: 'No Blog found' });
      }
    })
    .catch(error => errorHandler(error, req, res));
};



// module.exports.getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find().populate("author", "userName").exec();

//     const response = blogs.reduce((acc, blog) => {
//       const authorName = blog.author.userName;

//       if (!acc[authorName]) {
//         acc[authorName] = [];
//       }

//       acc[authorName].push({
//         id: blog._id,
//         title: blog.title,
//         content: blog.content,
//         createdOn: blog.createdOn,
//         comments: blog.comments
//       });

//       return acc;
//     }, {});

//     const formattedResponse = Object.keys(response).map(author => ({
//       author,
//       posts: response[author]
//     }));

//     res.status(200).json(formattedResponse);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports.getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId).populate("author", "userName").exec();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const response = {
      title: blog.title,
      content: blog.content,
      author: blog.author.userName, 
      createdOn: blog.createdOn,
      comments: blog.comments
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports.createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    blog.comments.push({ userId, comment });
    await blog.save();

    res.status(201).json({ message: "Comment added successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports.getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ comments: blog.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports.deleteAllComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    blog.comments = [];
    await blog.save();

    res.status(200).json({ message: "Comments deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

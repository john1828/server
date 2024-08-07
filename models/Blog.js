const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is Required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  comments:[
    {
      userId: {
        type: String,
        required: [true, "User Id is Required"],
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const blogRoutes = require("./routes/blog.js");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// User routes
app.use("/users", userRoutes);
// Blog routes
app.use("/blogs", blogRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`API is now available on port ${port}`));

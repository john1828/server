const express = require("express");
const userController = require("../controllers/user.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// Route for user registration
router.post("/register", userController.registerUser);
// Route for log in
router.post("/login", userController.loginUser);
// Route to get user details
router.get("/profile", verify, userController.getUserDetails);

module.exports = router;
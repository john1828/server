const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const { errorHandler } = auth;


// function for registering a user
module.exports.registerUser = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        if (!email || !userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!email.includes("@")) {
          return res.status(400).send({ error: "Email invalid" });
        }

        if (typeof userName !== 'string') {
            return res.status(400).json({ message: "Username must be a string" });
        }

        if (password.length < 8) {
          return res
            .status(400)
            .send({ error: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            userName,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Controller function to log in a user
module.exports.loginUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Invalid Email" });
  }
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({ error: "No Email found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        if (isPasswordCorrect) {
          return res.status(200).send({
            access: auth.createAccessToken(result),
          });
        } else {
          return res
            .status(401)
            .send({ message: "Email and password do not match" });
        }
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getUserDetails = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

        if(!user){
            // if the user has invalid token, send a message 'invalid signature'.
            return res.status(404).send({ message: 'invalid signature' })
        }else {
            // if the user is found, return the user.
            user.password = "";
            return res.status(200).send(user);
        }  
    })
    .catch(error => errorHandler(error, req, res));
};

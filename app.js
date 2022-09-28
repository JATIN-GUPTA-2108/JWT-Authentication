require("dotenv").config();
require("./config/database").connect();
const express = require("express");
// const crypto=require("crypto-js")
var SHA256 = require('crypto-js/sha256');


const app = express();

app.use(express.json());
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name,middle_name, last_name,country , role , phone, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name&&middle_name && country && role && phone )) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
    //   var key = "pwd@1234"
    //   var encrypted = crypto.AES.encrypt(password, key).toString();
var encrypted= JSON.stringify(SHA256(password).words);
      //Encrypt user password
    //   encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        middle_name,
        last_name,
        country,
        role,
        phone,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encrypted ,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password ,role } = req.body;
  
      // Validate user input
      if (!(email && password &&role    )) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
    //   if(JSON.stringify(SHA256(password).words) === user.password)
      if (user && (await JSON.stringify(SHA256(password).words) === user.password)) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// Logic goes here

module.exports = app;
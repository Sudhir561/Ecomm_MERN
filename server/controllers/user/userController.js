const Usermodel = require("../../model/user/useModel");
const cloudinary = require("../../Cloudinary/cloudinary");
const bcrypt=require('bcryptjs');
const validator=require('validator');
const transporter=require('../../helper');
const jwt=require('jsonwebtoken');
const secret_key= process.env.JWT_USER_SECRET_KEY
const path=require('path');
const fs=require('fs');
const ejs=require('ejs');


//register controller
exports.register = async (req, res) => {
  const { firstname, lastname, mobile, password, email, confirmpassword } =
    req.body;

  try {
    // Check if all fields are provided
    if (!firstname || !lastname || !mobile || !password || !email) {
      return res.status(400).json({ error: "all fields must be filled" });
    }

    // Check if user already exists with the same email
    const preUser = await Usermodel.findOne({ email: email });

    if (preUser) {
      return res.status(400).json({ error: "User Already Exist" });
    }
    // Check if mobile number is already registered
    const verifyMobile = await Usermodel.findOne({ mobile: mobile });
    if (verifyMobile) {
      return res.status(400).json({ error: "Mobile No Already Registered" });
    }
    // check if password match with confirm password
    if (password !== confirmpassword) {
      return res
        .status(400)
        .json({ error: "'Password and confirm password do not match' " });
    }

    // File upload to Cloudinary
    const file = req.file?.path;
    const upload = await cloudinary.uploader.upload(file);

    // Create a new user instance
    const userData = new Usermodel({
      firstname,
      lastname,
      email,
      userprofile: upload.secure_url,
      mobile,
      password,
    });

    // Save the user data to the database
    await userData.save();

    //send response with 201 status
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: userData,
      });

    // handle error
  } catch (error) {
    console.error("error in user register", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

// login controller

exports.login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;
  try {
    // Check if email or password is missing
    if (!email || !password) {
      // If either email or password is missing
      return res.status(400).json({ error: "Email and password are required." });
    }
    // Validate email format 
    if (!validator.isEmail(email)) {

      // If email format is invalid 
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Find user in the database based on the provided email
    const user = await Usermodel.findOne({ email });

    // Check if user exists
    if (!user) {

      // If user does not exist
      return res.status(404).json({ error: "User not found." });

    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if passwords match
    if (!isMatch) {

      // If passwords do not match, 
      return res.status(400).json({ error: "Invalid password." });
    }

    // Generate a JSON Web Token (JWT) for the authenticated user
    const token = await user.generateAuthToken();

    // If authentication is successful, 
    res.status(200).json({ success: true, user, token });

    //handle
  } catch (error) {
   
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// user verify controller
exports.userVerify = async function(req, res) {
  try {
      // Finding the user details in the database based on the user ID stored in the request object
      const userVerify = await Usermodel.findOne({ _id: req.userId });
      
      // Checking if user details are not found in the database
      if (!userVerify) {
          return res.status(404).json({ error: "User not found" });
      }
      
      // Sending a JSON response with the user details if found
      res.status(200).json(userVerify);
  } catch (error) {
      // Handling errors that occur during user verification
      console.error("Error in userVerify:", error);
      
      // Sending a 500 status with an error message for internal server error
     return  res.status(500).json({ error: "Internal server error" });
  }
};

// logout controller

exports.logout = async (req, res) => {
  try {
      //remove the current token from the user's tokens array
      req.rootUser.tokens = req.rootUser.tokens.filter(currentElement => {
          return currentElement.token !== req.token;
      });

      // Save the updated user object
      await req.rootUser.save();

      // Return a success response
      return res.status(200).json({ success: true, message: "User successfully logged out" });
  } catch (error) {
      // Return an error response if an error occurs
      console.error("Error in user logout:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
  }
};


//send password reset link controller
exports.forgotPassword = async (req, res) => {

  // Extract email from request body
  const email = req.body.email;

  // Check if email is provided
  if (!email) {
      // Return error response if email is empty
      return res.status(400).json({ error: "Email cannot be empty" });
  }

  try {
      // Find user with provided email
      const user = await Usermodel.findOne({ email: email });

      // If user not found, return error response
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Generate JWT token for password reset with  2 min expiry time
      const token = jwt.sign({ _id: user._id }, secret_key, { expiresIn: '1h' });

      // Update user document with generated token
      const setUserToken = await Usermodel.findByIdAndUpdate(user._id, { verifytoken: token }, { new: true });

      console.log(setUserToken);

      // Read email template file
      const emailTemplatePath = path.join(__dirname, "../../templateEmail/forgotTemplate.ejs");
      const emailTemplateContent = fs.readFileSync(emailTemplatePath, "utf8");

      
     
        // Set token and logo value in ejs file
         const data = {
          // Construct password reset link with user ID and token
           passwordresetlink:`http://localhost:3000/resetpassword/${user.id}/${setUserToken.verifytoken}`,
           logo:"https://cdn-icons-png.flaticon.com/128/732/732200.png"
           }

  

      // Render email template with dynamic data
      const renderedTemplate = ejs.render(emailTemplateContent, data);

      // Configure email options
      const mailOptions = {
          from: process.env.EMAIL_ADDRESS,
          to: email,
          subject: "Password Reset Link",
          html: renderedTemplate
      };

      // Send email using nodemailer transporter
      transporter.sendMail(mailOptions, (err, info) => {
          // Handle email sending errors
          if (err) {
              console.error("Error sending email:", err);
              return res.status(500).json({ error: "Failed to send email" });

          } else {
              console.log("Email sent:", info.response);
              return res.status(200).json({ message: "Email sent successfully" });
          }
      });
  } catch (error) {
      // Handle errors in try block
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ error: error});
  }
};

// verify user and token after  clicking on password reset link 
exports.userVerifyPasswordToken = async (req, res) => {
  const { id, token } = req.params;

  try {
      // Check if user with provided ID and token exists
      const validUser = await Usermodel.findOne({ _id: id, verifytoken: token });
      if (!validUser) {
          // If user or token is invalid, return error response
          return res.status(404).json({ success: false, error: "User or token not found" });
      }

      // Verify the token
      const verifyToken = await jwt.verify(token, secret_key);

      // Check if the token verification is successful
      if (!verifyToken) {
          // If token verification fails, return error response
          return res.status(401).json({ success: false, error: "Invalid token" });
      }

      // Return success response with valid user if token is verified
      return res.status(200).json({ success: true, validUser });
  } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error in userVerifyPasswordToken:", error);
      return res.status(500).json({ success: false, error: error });
  }
};

// chnage password controller
exports.changePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
      // Find the user by ID and verify the token
      const validUser = await Usermodel.findOne({ _id: id, verifytoken: token });

      if (!validUser) {
          return res.status(404).json({ success: false, error: "User or token not found" });
      }

      // Verify the token
      const verifyToken = await jwt.verify(token, secret_key);

      if (!verifyToken) {
          return res.status(401).json({ success: false, error: "Invalid token" });
      }

      // Validate the new password
      if (!password) {
          return res.status(400).json({ success: false, error: "Password is required" });
      }

      // Hash the new password
      const newPassword = await bcrypt.hash(password, 10);

      // Update the user's password in the database
      await Usermodel.findByIdAndUpdate(id, { password: newPassword });

      return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("error in changing password",error)
      return res.status(500).json({ success: false, error});
  }
};







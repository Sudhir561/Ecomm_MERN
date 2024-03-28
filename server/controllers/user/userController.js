const Usermodel = require("../../model/user/useModel");
const cloudinary = require("../../Cloudinary/cloudinary");
const bcrypt=require('bcryptjs');
const validator=require('validator');

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

    //handle error
  } catch (error) {
   
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

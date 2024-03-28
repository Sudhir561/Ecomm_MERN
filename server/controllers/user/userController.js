const Usermodel = require("../../model/user/useModel");
const cloudinary = require("../../Cloudinary/cloudinary");

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



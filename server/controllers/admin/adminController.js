const Admin = require('../../model/admin/adminModel');
const cloudinary = require('../../Cloudinary/cloudinary');
const bcrypt=require("bcryptjs")

// Register controller
exports.Register = async (req, res) => {
    const { name, email, mobile, password, confirmpassword } = req.body;

    try {
        // Check if all fields are provided
        if (!name || !email || !mobile || !password || !confirmpassword) {
            return res.status(400).json({ error: 'All fields are necessary' });
        }

        // Check if admin already exists with the same email
        const preuser = await Admin.findOne({ email: email });
        if (preuser) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Check if mobile number is already registered
        const mobileVerify = await Admin.findOne({ mobile: mobile });
        if (mobileVerify) {
            return res.status(400).json({ error: 'Mobile number is already registered' });
        }

        // Check if password matches the confirm password
        if (password !== confirmpassword) {
            return res.status(400).json({ error: 'Password and confirm password do not match' });
        }

        // // File upload to Cloudinary
        const file = req.file.path;
        const upload = await cloudinary.uploader.upload(file); // Await the upload process
       
        // Create a new admin instance
        const adminData = new Admin({
            name,
            email,
            mobile,
            password,
            profile: upload.secure_url // Use the uploaded image URL
        });

        // Save the admin data to the database
        await adminData.save();

        // Send success response
        res.status(201).json({ message: 'Admin registered successfully', adminData });
    } catch (error) {
        // Handle any errors
        res.status(400).json({ error: error.message });
    }
};

exports.Login=async(req,res)=>{

    const{email,password}=req.body;
    //console.log("input",req.body);

    try{
        // email and password not empty
    if(!email || !password){
        res.status(400).json({"error":"email and password cannot be empty"})
    }
    else{
        // email exist in db
        const validAdmin=await Admin.findOne({email:email});
        if(!validAdmin){
            res.status(400).json({"error":"invalid details"})
        }
        else{
            // compare password 
           const isMatch=bcrypt.compare(password,validAdmin);
           // if not match
           if(!isMatch){
            res.status(400).json({"error":"invalid details"})
           }
           // if match 
           else{
            // genearte token 
            const token= await validAdmin.generateAuthToken();
            console.log(token);
            const result={"message":"login succesful",validAdmin,token}
            res.status(200).json(result)
           }
        }
    }



    }catch(error){
        res.status(400).json(error);
    }
}

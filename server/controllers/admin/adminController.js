const AdminDb = require('../../model/admin/adminModel');
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
        const preuser = await AdminDb.findOne({ email: email });
        if (preuser) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Check if mobile number is already registered
        const mobileVerify = await AdminDb.findOne({ mobile: mobile });
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
        const adminData = new AdminDb({
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

//Login Controller
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
        const validAdmin=await AdminDb.findOne({email:email});
        if(!validAdmin){
            res.status(400).json({"error":"invalid details"})
        }
        else{
            // compare password 
           const isMatch= await bcrypt.compare(password,validAdmin.password);
           // if not match
           if(!isMatch){
            res.status(400).json({"error":"invalid details"})
           }
           // if match 
           else{
            // genearte token 
            const token= await validAdmin.generateAuthToken();
            //console.log(token);
            const result={"message":"login succesful",validAdmin,token}
            res.status(200).json(result)
           }
        }
    }



    }catch(error){
        res.status(400).json(error);
    }
}


// admin verify controller

exports.AdminVerify = async function(req, res) {
    try {
        // Finding the admin details in the database based on the user ID stored in the request object
        const adminVerify = await AdminDb.findOne({ _id: req.userId });
        
        // Checking if admin details are not found in the database
        if (!adminVerify) {
            return res.status(404).json({ error: "Admin not found" });
        }
        
        // Sending a JSON response with the admin details if found
        res.status(200).json(adminVerify);
    } catch (error) {
        // Handling errors that occur during admin verification
        console.error("Error in AdminVerify:", error);
        
        // Sending a 500 status with an error message for internal server error
        res.status(500).json({ error: "Internal server error" });
    }
};

// logout controller

exports.Logout= async(req,res)=>{
    try {
        req.rootUser.tokens=req.rootUser.tokens.filter(currentElement=>{
            return currentElement.token!==req.token
        }) 
        req.rootUser.save();
        res.status(200).json({message:"admin successfully logout"})
    } catch (error) {
        res.status(400).json(error)
    }
}



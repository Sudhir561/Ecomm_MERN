const express=require('express');
const router= new express.Router();

const adminAuthController=require('../../controllers/admin/adminController')
const adminUpload=require("../../multerconfig/admin/adminStorageConfig")
const adminAuthenticate=require('../../middleware/admin/adminAuthenticate')


// Route for registering a new admin user, using the 'adminUpload' middleware to handle file uploads
// and calling the 'Register' controller function from the 'adminAuthController' 
// This route expects a single file upload with the field name 'admin_profile'
router.post('/register', adminUpload.single('admin_profile'), adminAuthController.Register);

// Route for logging in an admin user, calling the 'Login' controller function from the 'adminAuthController'
router.post('/login', adminAuthController.Login);

// Route for verifying admin details, using the 'adminAuthenticate' middleware to authenticate users
// and calling the 'AdminVerify' controller function from the 'adminAuthController' 
router.get('/adminverify', adminAuthenticate, adminAuthController.AdminVerify);

// Route for admin logout
router.get('/logout',adminAuthenticate,adminAuthController.Logout);

// route for get all users
router.get('/getallusers',adminAuthenticate,adminAuthController.getAllUsers);






module.exports=router;
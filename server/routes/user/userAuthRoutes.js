const express=require('express');
const router= new express.Router();

const userUploads=require('../../multerconfig/user/userStorageConfig');
const userAuthController=require('../../controllers/user/userController');
const userAuthenticate=require('../../middleware/user/userAuthenticate')


// regsiter route
router.post('/register',userUploads.single('user_image'),userAuthController.register)

// login route
router.post('/login',userAuthController.login);

//verify user route

router.get('/userverify',userAuthenticate,userAuthController.userVerify)

// logout routes
router.get('/logout',userAuthenticate,userAuthController.logout)

// forgot password route

router.post('/forgotpassword',userAuthController.forgotPassword)

// Route for verifying password reset token and user id
router.get('/forgotpassword/:id/:token',userAuthController.userVerifyPasswordToken);

//route for changing password
router.put('/:id/:token',userAuthController.changePassword);








module.exports=router;



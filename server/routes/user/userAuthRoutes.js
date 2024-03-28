const express=require('express');
const router= new express.Router();

const userUploads=require('../../multerconfig/user/userStorageConfig');
const userAuthController=require('../../controllers/user/userController');
//const userAuthenticate=require('../../middleware/user/userAuthenticate')



router.post('/register',userUploads.single('user_image'),userAuthController.register)

router.post('/login',userAuthController.login);




module.exports=router;



const express=require('express');
const router= new express.Router();

const adminAuthController=require('../../controllers/admin/adminController')
const adminUpload=require("../../multerconfig/admin/adminStorageConfig")
// admin auth routes
router.post('/register',adminUpload.single('admin_profile'),adminAuthController.Register)

router.post('/login',adminAuthController.Login)




module.exports=router;
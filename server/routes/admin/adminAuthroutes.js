const express=require('express');
const router= new express.Router();

const adminAuthController=require('../../controllers/admin/adminController')

// admin auth routes
router.post('/register',adminAuthController.Register)




module.exports=router;
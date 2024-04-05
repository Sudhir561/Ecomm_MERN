const express=require('express');
const router= new express.Router();
const cartsController=require('../../controllers/carts/cartsController') 
const userAuthenticate=require('../../middleware/user/userAuthenticate')

router.post('/addtocarts/:id',userAuthenticate,cartsController.addToCart)

module.exports=router;
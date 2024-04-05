const express=require('express');
const router= new express.Router();
const cartsController=require('../../controllers/carts/cartsController') 
const userAuthenticate=require('../../middleware/user/userAuthenticate');  // middleware for authenticate the user 

// addtocarts routes (by providing product id )
router.post('/addtocarts/:id',userAuthenticate,cartsController.addToCart)

router.get('/getcarts',userAuthenticate,cartsController.getCartsValue)
module.exports=router;
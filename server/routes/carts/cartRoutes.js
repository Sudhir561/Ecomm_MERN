const express=require('express');
const router= new express.Router();
const cartsController=require('../../controllers/carts/cartsController') 
const userAuthenticate=require('../../middleware/user/userAuthenticate');  // middleware for authenticate the user 

// addtocarts routes (by providing product id )
router.post('/addtocarts/:id',userAuthenticate,cartsController.addToCart)
// getCart routes
router.get('/getcarts',userAuthenticate,cartsController.getCartsValue)

// remove single item routes

router.delete("/removesingleitem/:id",userAuthenticate,cartsController.removeSingleItem)

//remove all items of specific product
router.delete('/removeallitems/:id',userAuthenticate,cartsController.removeAllItems)

// delete all data carts  (when order is placed )routes

router.delete('/deletecartdata',userAuthenticate,cartsController.deleteCartData)

module.exports=router;


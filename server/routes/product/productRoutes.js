const express=require("express")
const router= express.Router();
const adminauthenticate=require("../../middleware/admin/adminAuthenticate")
const productController=require('../../controllers/product/productController');
const productuploads=require("../../multerconfig/product/productStorageConfig");



//product category routes

router.post('/addcategory',adminauthenticate,productController.AddCategory)
router.get('/getcategory',productController.GetCategory)

// product routes

router.post('/addproduct',[adminauthenticate,productuploads.single("productimage")],productController.AddProduct)

router.get('/getproducts',productController.GetAllProducts)

router.get('/getsingleproduct/:productid',productController.getSingleProduct)

router.get('/getlatestproducts',productController.getLatestProducts);

router.get('/deleteproduct/:productid',adminauthenticate,productController.deleteProduct)

module.exports=router;

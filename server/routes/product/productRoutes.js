const express=require("express")
const router= express.Router();
const adminauthenticate=require("../../middleware/admin/adminAuthenticate")
const productController=require('../../controllers/product/productController');
const productuploads=require("../../multerconfig/product/productStorageConfig");
const userAuthenticate=require('../../middleware/user/userAuthenticate')


//product category routes

router.post('/addcategory',adminauthenticate,productController.AddCategory)
router.get('/getcategory',productController.GetCategory)

// product routes

router.post('/addproduct',[adminauthenticate,productuploads.single("productimage")],productController.AddProduct)

router.get('/getproducts',productController.GetAllProducts)

router.get('/getsingleproduct/:productid',productController.getSingleProduct)

router.get('/getlatestproducts',productController.getLatestProducts);

router.get('/deleteproduct/:productid',adminauthenticate,productController.deleteProduct);

// products review api
router.post("/productreview/:productid",userAuthenticate,productController.productReview);

// get product reviews 
router.get("/getproductreviews/:productid",userAuthenticate,productController.getProductReviews);

// delete product review

router.delete("/deleteproductreview/:reviewid",userAuthenticate,productController.deleteProductReview);

module.exports=router;

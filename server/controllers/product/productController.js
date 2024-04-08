const categorydb = require('../../model/product/productCategoryModel');
const cloudinary=require('../../Cloudinary/cloudinary');
const productdb = require('../../model/product/productModel');
const ProductReviewDb=require('../../model/product/productReviewModel')

exports.AddCategory = async (req, res) => {
    const { categoryname, description } = req.body;

    // Check if required fields are missing in the request body
    if (!categoryname || !description) {
        return res.status(400).json({ error: "All details must be filled" });
    }

    try {
        // Check if the category already exists
        const existingCategory = await categorydb.findOne({ categoryname: categoryname });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }

        // Create a new category
        const newCategory = new categorydb({ categoryname, description });
        await newCategory.save();

        // Respond with the newly created category
        res.status(201).json(newCategory);
    } catch (error) {
        // Handle errors 
        console.error("Error in AddCategory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//get All category
exports.GetCategory=async(req,res)=>{
    try {
        const allCategory= await categorydb.find();
        //  if no category found
        if(allCategory.length===0){
            res.status(404).json({message:"no any category added"})
        }
        // if category exist

        else{
            res.status(200).json(allCategory)
        }
    } catch (error) {
        console.error("Error in GetCategory:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

//add product
exports.AddProduct=async(req,res)=>{
   const {categoryid}=req.query;
   const file=req.file?req.file.path:""
   const {productname,price,discount,quantity,description}=req.body
   
   if(!productname || !price || !discount || !quantity || !description){
    res.status(400).json({error:"all field require"})
   }
   try {
    const upload=await cloudinary.uploader.upload(file);
    const existingProduct=await productdb.findOne({productname:productname})

    if(existingProduct){
        res.status(400).json({error:"this product already exist"})
    }
    else{
        const addProduct= new productdb({
            productname,price,discount,quantity,description,profileimage:upload.secure_url,categoryid:categoryid
        })
        await addProduct.save()
        res.status(201).json(addProduct)
    }
   } catch (error) {
     res.status(400).json(error)
   }
}


// getall products with pagination and can be filter by category
exports.GetAllProducts = async (req, res) => {
    try {
        const categoryid = req.query.categoryid || "";
        const Query = {};
        
        // Check if categoryid is provided and not equal to "all"
        if (categoryid && categoryid !== "all") {
            Query.categoryid = categoryid;
        }

        const page = parseInt(req.query.page) || 1; // Parse page number as integer
        const itemPerPage = 8;
        const skip = (page - 1) * itemPerPage;

        // Count total number of documents matching the query criteria
        const count = await productdb.countDocuments(Query);

        // Calculate total number of pages required for pagination
        const totalPages = Math.ceil(count / itemPerPage);

        // Fetch products based on query criteria, limit, and pagination
        const allProducts = await productdb.find(Query)
            .limit(itemPerPage)
            .skip(skip);

        // Respond with fetched products and pagination information
        res.status(200).json({
            allProducts,
            pagination: {
                totalProducts: count,
                totalPages // Renamed countPage to totalPages for clarity
            }
        });
    } catch (error) {
        // Handle errors appropriately
        console.error("Error in GetAllProducts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//get single product .productid as params
exports.getSingleProduct=async(req,res)=>{
    try {
        const productId=req.params.productid;
        const product=await productdb.findOne({_id:productId})
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json(error)
    }
}

//new arrival product(latest product)

exports.getLatestProducts=async(req,res)=>{
    try {
        // sort in descending order to get latest product
       const latestProducts=await productdb.find().sort({_id:-1}) 
       res.status(200).json(latestProducts)
    } catch (error) {
        console.error('Error in getLatestProduct:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//delete product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productid;

        // Find the product by ID and delete it
        const deletedProduct = await productdb.findByIdAndDelete(productId);

        // If no product was found with the given ID
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Respond with success message
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// add product Review
exports.productReview = async (req, res) => {
    const productId = req.params.productid;
    const { username, rating, description } = req.body;

    // Check if all required fields are provided
    if (!username || !rating || !description || !productId) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Find the product by ID
        const product = await productdb.findById(productId);
        
        // If product not found, return a 404 error response
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create a new product review instance
        const productReview = new ProductReviewDb({
            userid: req.userMainId,
            productid: productId,
            username,
            rating,
            description
        });

        // Save the product review to the database
        await productReview.save();

        // Return success message and the product review
        res.status(201).json({ message: "Product review added", productReview });
    } catch (error) {
        // Handle errors
        res.status(400).json(error);
    }
}

// get product Reviews controller

exports.getProductReviews = async (req, res) => {
    const productId = req.params.productid;

    try {
        // Check if productId is provided
        if (!productId) {
            return res.status(404).json({ error: "No product found" });
        }
        
        // Find product reviews by productId
        const productReviews = await ProductReviewDb.find({ productid: productId });

        // If no reviews found, return a 404 error response
        if (!productReviews || productReviews.length === 0) {
            return res.status(404).json({ error: "No reviews found for this product" });
        }

        // Return the product reviews
        res.status(200).json(productReviews);
    } catch (error) {
        // Handle errors
        res.status(400).json(error);
    }
}

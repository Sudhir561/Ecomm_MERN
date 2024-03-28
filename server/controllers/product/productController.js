const categorydb = require('../../model/product/productCategoryModel');
const cloudinary=require('../../Cloudinary/cloudinary');
const productdb = require('../../model/product/productModel');

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

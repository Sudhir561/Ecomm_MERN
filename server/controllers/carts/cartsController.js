const productdb = require('../../model/product/productModel'); // Importing the product model
const CartsDb = require('../../model/carts/cartsModel'); // Importing the carts model

// Controller function for adding a product to the cart
exports.addToCart = async (req, res) => {
    const { id } = req.params; // Extracting product ID from request parameters
    try {
        // Finding the product in the database by ID
        const productFind = await productdb.findOne({ _id: id });
        
        // If product is not found, return a 404 error response
        if (!productFind) {
            return res.status(404).json({ error: "No product found" });
        }

        // Finding the cart item in the database by user ID and product ID
        const carts = await CartsDb.findOne({ userid: req.userId, productid: productFind._id });

        // If product quantity is greater than or equal to 1
        if (productFind?.quantity >= 1) {

            // If the cart item already exists
            if (carts?.quantity >= 1) {

                // Increment the quantity of the existing cart item
                carts.quantity = carts.quantity + 1;

                await carts.save(); // Save the updated cart item
                
                // Decrement the quantity of the product
                productFind.quantity = productFind.quantity - 1;
                await productFind.save(); // Save the updated product
                
                // Return a success response with the updated cart item
                return res.status(200).json({ message: "Product successfully incremented in cart", carts });

            } else {
                // Create a new cart item
                const newCart = new CartsDb({
                    userid: req.userId,
                    productid: productFind._id,
                    quantity: 1
                });
                await newCart.save(); // Save the new cart item
                
                // Decrement the quantity of the product
                productFind.quantity = productFind.quantity - 1;
                await productFind.save(); // Save the updated product
                
                // Return a success response with the new cart item
                return res.status(201).json({ message: "Product successfully added to cart", carts: newCart });
            }
        } else {
            // If product quantity is 0 or less, return a 400 error response
            return res.status(400).json({ error: "This product is sold out" });
        }
    } catch (error) {
        // If there's an error, return a 400 error response with the error message
        res.status(400).json(error);
    }
}

// getCartsDetails controller
exports.getCartsValue = async (req, res) => {
    try {
        // Perform aggregation to get cart details along with product details
        const getCarts = await CartsDb.aggregate([
            // Match carts for a specific user who is added the product in carts
            {
                $match: { userid: req.userMainId }
            },
            // Lookup product details based on productid
            {
                $lookup: {
                    from: "productsmodels", // Collection to perform the lookup
                    localField: "productid", // Field in the current collection
                    foreignField: "_id", // Field in the target collection
                    as: "productDetails" // Alias for the joined data
                }
            }
        ]);
        
        // Return the cart details as response
        res.status(200).json(getCarts);
    } catch (error) {
       
        res.status(400).json(error);
    }
}

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
        if(getCarts.length===0){
            return res.status(404).json({error:"cart is empty"});
        }
        // Return the cart details as response
        res.status(200).json(getCarts);
    } catch (error) {
       
        res.status(400).json(error);
    }
}

// remove single item 

exports.removeSingleItem = async (req, res) => {
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

        if (carts?.quantity > 1) {
            // If quantity in carts is greater than 1, decrement the quantity in the carts
            carts.quantity = carts.quantity - 1;
            await carts.save();

            // Increment the quantity of the product
            productFind.quantity = productFind.quantity + 1;
            await productFind.save();

            return res.status(200).json({ message: "Product quantity successfully decremented", carts });

        } else if (carts?.quantity === 1) {
            // If cart quantity is 1, remove the item from the cart
            const deleteItem = await CartsDb.findByIdAndDelete({ _id: carts._id });

            // Increment the quantity of the product
            productFind.quantity = productFind.quantity + 1;
            await productFind.save();

            return res.status(200).json({ message: "Product removed from cart", deleteItem });
        } else {
            // If the product is not added to the cart or quantity is less than 1, return an error response
            return res.status(400).json({ error: "Product is not added in the cart" });
        }
    } catch (error) {
        
        res.status(400).json(error);
    }
}

// remove all items of specific product
exports.removeAllItems = async (req, res) => {
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
        
        // If cart is empty,
        if (!carts) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Remove all items of the specific product from the cart
        const deleteItems = await CartsDb.findByIdAndDelete({ _id: carts._id });

        // Increment the quantity of the product by cart quantity
        productFind.quantity = productFind.quantity + carts.quantity;
        await productFind.save();

        
        res.status(200).json({ message: "All items removed from cart", deleteItems });
    } catch (error) {
       
        res.status(400).json(error);
    }
}


// empty cart when order placed
exports.deleteCartData = async (req, res) => {
    try {
        // Count the number of documents in the cart collection
        const count = await CartsDb.countDocuments();

        // If cart is already empty, return a 400 error response
        if (!count) {
            return res.status(400).json({ error: "Cart is already empty" });
        }

        // Delete all cart data for the current user
        const deleteCart = await CartsDb.deleteMany({ userid: req.userId });

        // Return success message
        res.status(200).json({ message: "All data deleted, cart is empty now", deleteCart });
    } catch (error) {
        // Handle errors
        res.status(400).json(error);
    }
}




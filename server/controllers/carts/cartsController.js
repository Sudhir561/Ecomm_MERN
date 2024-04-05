const productdb = require('../../model/product/productModel')
const CartsDb=require('../../model/carts/cartsModel')



exports.addToCart = async (req, res) => {
    const { id } = req.params;
    try {
        const productFind = await productdb.findOne({ _id: id });
        if (!productFind) {
            return res.status(404).json({ error: "No product found" });
        }

        const carts = await CartsDb.findOne({ userid: req.userId, productid: productFind._id });
        if (carts) {
            carts.quantity = carts.quantity + 1;
            await carts.save();
            return res.status(200).json({ message: "Product successfully incremented in cart", carts });
        } else {
            const newCart = new CartsDb({
                userid: req.userId, // Fix typo here
                productid: productFind._id,
                quantity: 1
            });
            await newCart.save();
            return res.status(201).json({ message: "Product successfully added to cart", carts: newCart });
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

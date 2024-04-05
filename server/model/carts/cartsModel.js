const mongoose=require('mongoose');

// create schema 
const cartSchema=new mongoose.Schema({
    // login user id which add the product
    userid:{
        type:String,
        required:true
    },

    // id of product 
    productid:{
        type:Object,
        required:true
    },

    quantity:{
        type:Number
    }
},{timestamps:true});

// Create the model for the cart
const CartsDb=new mongoose.model('carts',cartSchema)
module.exports=CartsDb;
const mongoose=require('mongoose');
const validator=require('validator');

// schema
const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        // validate emailformat
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not valid email')
            }
        }
    },

    profile:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
        minLength:10,
        maxLength:10
    },
    password:{
        type:String,
        required:true,
    },
// stroing token for authentication
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// model
const Admin=new mongoose.model("admins",adminSchema)
module.exports=Admin;
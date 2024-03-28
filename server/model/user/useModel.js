const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const secret_key=process.env.JWT_USER_SECRET_KEY;

// schema
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
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

    userprofile:{
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
},{timestamps:true})

//password hashing
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
        next();
    }
})




// model
const Usermodel=new mongoose.model("users",userSchema)
module.exports=Usermodel;





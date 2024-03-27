const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const secret_key=process.env.JWT_SECRET_KEY;

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

//password hashing
adminSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
        next();
    }
})

// token generate

adminSchema.methods.generateAuthToken=async function(){
  try{
    const newToken=jwt.sign({_id:this._id},secret_key,{expiresIn:"1d"})
    this.tokens=this.tokens.concat({token:newToken});
    this.save();
    return newToken;
  }catch(error){
    // Handle the error accordingly, such as logging it or throwing it
    throw error;
  }
}

// model
const Admin=new mongoose.model("admins",adminSchema)
module.exports=Admin;
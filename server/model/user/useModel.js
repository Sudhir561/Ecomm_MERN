const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret_key = process.env.JWT_USER_SECRET_KEY;

// schema
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      // validate emailformat
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("not valid email");
        }
      },
    },

    userprofile: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      minLength: 10,
      maxLength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    // stroing token for authentication
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

//password hashing
userSchema.pre("save", async function (next) {
  // if password modified or registerd 
  if (this.isModified("password")) {
    //password hashing with 10 salt round 
    this.password = await bcrypt.hash(this.password, 10);

    next();
  }

});

//generate token
userSchema.methods.generateAuthToken = async function () {
  try {
    const newtoken = jwt.sign({ _id: this._id }, secret_key, {
      expiresIn: "1d",
    }); // generate jwt token

    this.tokens = this.tokens.concat({ token: newtoken }); // add new token to tokens array in users in db

    await this.save(); //save in db

    return newtoken; // return created token

  } catch (error) {

    throw error;
  }
};

// model
const Usermodel = new mongoose.model("users", userSchema);
module.exports = Usermodel;

const jwt=require('jsonwebtoken');  
const secret_key=process.env.JWT_USER_SECRET_KEY;
const UserModel=require('../../model/user/userModel')


/// Defining the middleware function for authenticating  users
const userAuthenticate = async function(req, res, next) {
    try {
        // Extracting the JWT token from the Authorization header in the request
        const token = req.headers.authorization;

        // Checking if the JWT token is missing in the request headers
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. No token provided." });
        }

        // Verifying the JWT token using the secret key
        const verifyToken = jwt.verify(token, secret_key);

        // Finding the user in the database based on the ID stored in the JWT token
        const rootUser = await UserModel.findById(verifyToken._id);
        
        // Checking if the user is not found in the database
        if (!rootUser) {
            throw new Error("User not found");
        }

        // Storing the retrieved  user, user ID, and token in the request object
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        req.token = token;
        req.userMainId=rootUser.id;

        // Calling the next middleware function in the chain or calling the  controller
        next();
    } catch (error) {
        // Handling errors that occur during authentication
        console.error("Error in userAuthenticate:", error);
        res.status(401).json({ error: "Unauthorized. Invalid token." });
    }
};


module.exports=userAuthenticate
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

 const authmiddleware = asyncHandler(async(req, res, next)=>{
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.userId);
                req.user = user;
                next();
            }

        }catch(error){
            throw new Error("Not authorized token or token expired, Please try login again")
        }
    }else{
        throw new Error("There is no token attached to the header")
    }
});

const isAdmin = asyncHandler(async(req, res, next)=>{
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if (adminUser.role !== "Admin"){
        throw new Error("you are not an admin")
    }else{
     next();
    }
})

module.exports = {authmiddleware, isAdmin}
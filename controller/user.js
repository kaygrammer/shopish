const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbid")
const {generateRefreshToken} = require("../config/refreshToken")
const {generateToken} = require("../config/jwtToken")
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController")
const crypto = require("crypto");



const createUser = async (req, res) =>{
    try{
    const email = req.body.email;
    const findUser = await User.findOne({email});
    if (!findUser){
        // create a new user
        const newUser = await User.create(req.body)
        res.status(200).json({
            success:true,
            message:"user created successfully",
            newUser
        })
    }else{
        res.status(400).json({
            success:false,
            msg: "User already exists" 
        })
    }
}catch(err){
    res.status(500).json(err);
}
}

const login = asyncHandler (async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new Error('Please provide email and password')
    }
    const user = await User.findOne({ email })
    //compare password
    if(!user){
        throw new Error('invalid credentials')
    }
    const isPasswordCorrect = await user.isPasswordMatched(password)
    if (!isPasswordCorrect){
        throw new Error('invalid credentials')
    }
    const token = user.createJWT();
    const refreshToken = await generateRefreshToken(user?.id);
    const updateuser = await User.findByIdAndUpdate(user.id, {
         refreshToken: refreshToken
     },
     {new: true})
     console.log(updateuser);
     res.cookie('refreshToken', refreshToken,{
     httpOnly:true,
     maxAge:72*60*60*1000,})
    res.status(201).json({ user: {name: user.firstName}, token})
});


// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new Error(" No Refresh token present in db or not matched")
    };
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?.id);
      res.status(200).json({ accessToken });
    });
  });
  
// logout functionality

const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if (!cookie?.refreshToken){
    throw new Error("No Refresh Token in Cookies")
};
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly:true,
            secure:true,
        });
        return res.status(204).json("forbidden request")//forbidden
    };
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly:true,
        secure:true,
    });
    return res.status(200).json({message:"log out successful"})
    

})


// get all users
const getalluser = (asyncHandler(async (req, res) =>{
    try{
        const allusers = await User.find()
        if(allusers == ""){
        return res.status(400).json({
            success:true,
            message:"no user available in the database"
        })
        }
        else{
        return res.status(200).json({
            success:true,
            allusers
        })}
    }catch(err){
        return (err.message)
    }    

}));

// get a single user
const getAUser = (asyncHandler(async (req, res) => {
    try{
        const {id} = req.params
        validateMongoDbId(id)
        const getAUser = await User.findById(id)
        if(!getAUser){
            return res.status(400).json({
                success:true,
                message:`user with ${id} not found`
            })
        }
        return res.status(200).json({
            success:true,
            getAUser
        })
    }catch(err){
        return (err.message)
    }
}));

// delete a single user
const deleteAUser = (asyncHandler(async (req, res) => {
    try{
        const {id} = req.params
        validateMongoDbId(id)
        const getAUser = await User.findByIdAndDelete(id)
        if(!getAUser){
            return res.status(400).json({
                success:true,
                message:`user with ${id} not found`
            })
        }
        return res.status(200).json({
            success:true,
            message:`user with ${id} was deleted successfully`
        })
    }catch(err){
        return (err.message)
    }
}));

// update a user

const updateUser = (asyncHandler(async (req, res)=>{
    try{
        const {id} = req.user;
        validateMongoDbId(id)
        const updateUser = await User.findByIdAndUpdate(id,
            {
            firstName:req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new:true,
        });
        // if(!updateUser){
        //     throw new Error(`~not found`)
        // }
        return res.status(200).json({
            success:true,
            message:`user with ${id} was updated successfully`,
            updateUser
        })
    }catch(err){
        return (err.message)
    }
}))

const blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {new: true}
        )
        return res.status(200).json({
            message:"user blocked successfully"

        })
    }catch(error){
        throw new Error(error)
    }

})

const unblockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {new: true}
        )
        return res.status(200).json({
            message:"user unblocked successfully"
            
        })
    }catch(error){
        throw new Error(error)
    }    
})

const test =  asyncHandler(async(req, res)=>{
    res.send("testing");
    console.log("testing");
})

const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById({_id});
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword)
    }else{
        res.json(user)
    }
})

const forgotPasswordToken = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error(`user with email ${email} not found`)
    try{
        const token = await user.createPasswordResetToken()
        await user.save();
        const resetURL = `Hi, Please follow this lin to reset you password. the link is valid for 10mins. <a href='http://localhost:4000/api/user/reset.password/${token}'>Click Here</a>`
        const data = {
            to:email,
            text: "hey user",
            subject:"Forgot password link",
            htm: resetURL,
        };
        sendEmail(data)
        res.json(token)
    }catch(error){
        throw new Error(error)
    }
})

const resetPassword = asyncHandler(async(req, res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires:{$gt:Date.now()},
    })
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
})
module.exports = {createUser, login, getalluser, getAUser, deleteAUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, test, updatePassword, forgotPasswordToken, resetPassword}

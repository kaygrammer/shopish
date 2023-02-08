const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")



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
    res.status(200).json({ user: {name: user.firstName}, token})
});

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
    console.log(req.params);
    try{
        const {id} = req.params
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
    console.log(req.params);
    try{
        const {id} = req.params
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

module.exports = {createUser, login, getalluser, getAUser, deleteAUser}
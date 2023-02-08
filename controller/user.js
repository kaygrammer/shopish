const User = require("../models/userModel")



const createUser = async (req, res) =>{
    const email = req.body.email;
    const findUser = await User.findOne(email);
    if (!findUser){
        // create a new user
    }else{
        
    }
}
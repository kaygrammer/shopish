const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: "user"
    },
    isBlocked:{
        type:Boolean,
        default:false,

    },
    cart:{
        type:Array,
        default: [],
    },
    address:[{
        type:mongoose.Types.ObjectId,
        ref: "Address"
    }],
    wishList:[
        {
            type:mongoose.Types.ObjectId,
            ref: "Product"
        },
    ],
}, {
    timestamps:true,
});


userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
    return jwt.sign({userId:this._id, name:this.firstName+this.lastName}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME,})
}

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


//Export the model
module.exports = mongoose.model('User', userSchema);



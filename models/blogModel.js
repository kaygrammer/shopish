const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numView:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisLiked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    disLikes:[
        {
            type:mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    image:{
        type:String,
        default:"https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-600w-1029506242.jpg"
    },
    author:{
        type:String,
        default:"Admin"
    },
},
{
    toJSON:{
        virtuals:true,
    }, toObject:{
        virtuals:true,
    },
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
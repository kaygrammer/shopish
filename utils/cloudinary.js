const cloudinary = require("cloudinary");
require('dotenv').config()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.API_SECRET
})


const cloudinaryuploading = async(fileToUploads) =>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUploads, (result)=>{
            resolve(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: "auto",
                }
            )
        })
    })
}

module.exports = cloudinaryuploading;

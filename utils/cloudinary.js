const cloudinary = require("cloudinary").v2;
require('dotenv').config()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:CLOUDINARY_KEY,
    api_secret:API_SECRET
})


const cloudinaryuploading = async(fileToUploads) =>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUploads, (result)=>{
            resolve(
                {
                    url:result.secure_url,
                },
                {
                    resource_type: "auto"
                }
            )
        })
    })
}

module.exports = cloudinaryuploading;

const multer = require("multer")
const sharp = require("sharp")
const path = require("path")


const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename:function(req, file, cb){}
})

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 2000000}
});
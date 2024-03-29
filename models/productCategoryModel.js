const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Productcategory', productCategorySchema);
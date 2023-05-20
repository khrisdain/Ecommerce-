import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const blogCatModel = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
},{timestamps: true});

//Export the model
const blogCategory = mongoose.model("BlogCategory", blogCatModel);

export default blogCategory;
//Taking a rest FOR 2ND today
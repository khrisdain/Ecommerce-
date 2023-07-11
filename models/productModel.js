import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,                                                                                  
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type: Number,
        required:true,
    },
    category:{
        type: String,
        required: true,
        lowercase: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array
    },
    color: [],
    ratings: [
        {
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        },
    ],
    totalrating: {
        type: String,
        default: 0,
    }
}, {timestamps: true})

//Export the model
const Product = mongoose.model('Product', productSchema);

export default Product;
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
    Views:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes:[
        {
            type: mongoose.Schema.type.ObjectId,
            ref: "User",
        },   
    ],
    dislikes:[
        {
            type: mongoose.schema.types.ObjectId,
            ref: "User"
        },
    ],
    image: {
        type: String,
        default: "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-1029506242"
    }
});

//Export the model
const blogs = mongoose.model('Blogs', blogSchema);

export default blogs;
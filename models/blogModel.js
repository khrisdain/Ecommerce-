import mongoose from "mongoose"
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
    {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        numViews: {
          type: Number,
          default: 0,
        },
        isLiked: {
          type: Boolean,
          default: false,
        },
        isDisLiked: {
          type: Boolean,
          default: false,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
    
        author: {
          type: String,
          default: "Admin",
        },
        images: [],
      },
      {
        toJSON: {
          virtuals: true,
        },
        toObject: {
          virtuals: true,
        },
        timestamps: true,
    }
);
//today's change

//Export the model
const blogs = mongoose.model('Blog', blogSchema);

export default blogs;
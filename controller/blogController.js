import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongodbId.js";

export const createBlog = asyncHandler( async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        })
    }catch(error){
        throw new Error(error)
    }
})

//update logics get respawned across few controllers
export const updateBlog = asyncHandler( async(req, res) => {
    const { id } = req.params;
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true}) //id, update, option parameter(new true updtas the Blog after implementation)
        res.json(updateBlog);
    }catch(error){
        throw new Error(error)
    }
});

export const getBlog = asyncHandler( async(req, res) => {
    const { id } = req.params
    try{
        const getABlog = await Blog.findById(id)
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { Views: 1 } 
            },
            {
                new: true
            }            
        ) //$inc reps increment as oppose to set and val is set at 1
        res.json(updateViews)
    }catch(error){
        throw new Error(error)
    }
});


export const getAllBlogs = asyncHandler(async(req, res) => {
    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs)
    }catch(error){
        throw new Error(error)
    }
});

export const deleteBlog = asyncHandler( async(req, res) => {
    const { id } = req.params;
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog)
    }catch(error){
        throw new Error(error)
    }
});


export const likeBlog = asyncHandler( async(req, res) => {
    const { blogId } = req.body;
    validateMongoDBId(blogId);

    //search for blog to be liked
    const blog = await blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    //find if user has liked the blog
    const isLiked = blog?.isLiked;
    //check if user dislikes
    const alreadyDisLikes = blog?.dislikes?.find(
        (userId = userId?.toString() === loginUserId?.toString())
    );

    if(alreadyDisLikes) {
        //$pull($: odm character) removs value from an array field in the document
        const blog = await blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
        { new: true }
      );
      res.json(blog)
    };

    if(isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId},
                isLiked: true,
            },
            {new: true}
        );
        res.json(blog)
    } else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        )
        res.json(blog)
    }
});


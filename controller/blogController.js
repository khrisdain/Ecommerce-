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
        const getABlog = await Blog.findById(id).populate("dislikes").populate("likes")
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { Views: 1 } 
            },
            {
                new: true
            }            
        ) //$inc reps increment as oppose to set and val is set at 1
        res.json(getABlog);
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



export const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    console.log(blogId)
    validateMongoDBId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });


  
  export const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDBId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });
  //resting for todays thanks
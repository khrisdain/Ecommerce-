import express from "express"
import {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    disLikeBlog,
} from "../controller/blogController.js"
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBlog)
router.put("/likes", authMiddleware, likeBlog)
router.put("/disLikes", authMiddleware, disLikeBlog)

router.put("/:id", authMiddleware, isAdmin, updateBlog)

router.get("/:id", getBlog)
router.get("/", getAllBlogs)
router.delete("/", authMiddleware, isAdmin, deleteBlog)

export default router;
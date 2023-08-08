import express from "express"
import {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,
} from "../controller/blogController.js"
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"
import { blogImgResize, uploadPhoto } from "../middlewares/uploadImages.js"

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBlog)
router.put("/likes", authMiddleware, likeBlog)
router.put("/dislikes", authMiddleware, dislikeBlog)
router.put(
    "/upload"
)
router.put("/:id", authMiddleware, isAdmin, updateBlog)

router.get("/:id", getBlog)
router.get("/", getAllBlogs)
router.delete("/", authMiddleware, isAdmin, deleteBlog)

export default router;
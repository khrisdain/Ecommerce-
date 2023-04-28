import express from "express"
import {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs
} from "../controller/blogController.js"
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBlog)
router.get("/:id", getBlog)
router.get("/", getAllBlogs)
router.put("/:id", authMiddleware, isAdmin, updateBlog)

export default router;
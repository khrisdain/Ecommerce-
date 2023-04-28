import express from "express"
import {
    createBlog,
    updateBlog
} from "../controller/blogController.js"
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBlog)
router.put("/update/:id", authMiddleware, isAdmin, updateBlog)

export default router;
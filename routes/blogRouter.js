import express from "express"
import {
    createBlog
} from "../controller/blogController.js"
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBlog)

export default router;
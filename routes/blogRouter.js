import express from "express"
import {
    createBlog
} from "../controller/blogController.js"
import { isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", isAdmin, createBlog)

export default router;
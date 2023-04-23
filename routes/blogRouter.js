import express from "express"
import {
    createBlog
} from "../controller/blogController.js"

const router = express.Router()

router.post("/", createBlog)

export default router;
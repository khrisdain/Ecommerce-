import express from "express";
import { 
    createBlogCategory
} from "../controller/blogCatController.js"
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/", createBlogCategory)
export default router;
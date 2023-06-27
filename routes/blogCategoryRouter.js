import express from "express";
import { 
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getAllBlogCategory,
    getABlogCategory,
} from "../controller/blogCatController.js"
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()
router.get("/:id", getABlogCategory)
router.get("/", getAllBlogCategory)
router.post("/", authMiddleware, isAdmin, createBlogCategory)
router.put("/:id", authMiddleware, isAdmin, updateBlogCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCategory)
export default router;
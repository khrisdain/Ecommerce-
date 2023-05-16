import express from "express";
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
} from "../controller/categoryController.js"
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory)
router.put("/:id", authMiddleware, isAdmin, updateCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)
router.get("/:id", getCategory)

export default router;

















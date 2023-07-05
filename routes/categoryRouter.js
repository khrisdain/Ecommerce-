import express from "express";
import{
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory,
} from "../controller/categoryController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router()


router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/:id", authMiddleware, isAdmin, getCategory);
router.get("/", authMiddleware, isAdmin, getAllCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

export default router;












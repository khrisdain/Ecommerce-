import express from "express";
import { 
    createProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    logout,
} from "../controller/productControl.js";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createProduct)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)
router.post("/:id", logout)
export default router;
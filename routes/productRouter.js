import express from "express";
import { 
    createProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
} from "../controller/productControl.js";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createProduct)
router.put("/wishlist", authMiddleware, isAdmin, addToWishlist)
router.put("/rating", authMiddleware, rating)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)
export default router;
import express from "express";
import { 
    createProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
} from "../controller/productControl.js";

const router = express.Router()

router.post("/", createProduct)
router.get("/:id", getAProduct)
router.put("/:id", updateProduct)
router.get("/", getAllProducts)

export default router;
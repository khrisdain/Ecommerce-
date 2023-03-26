import express from "express";
import { 
    createProduct,
    getAProduct,
    getAllProducts
} from "../controller/productControl.js";

const router = express.Router()

router.post("/", createProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)

export default router;
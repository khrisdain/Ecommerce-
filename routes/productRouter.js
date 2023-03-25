import express from "express";
import { 
    createProduct,
    getAProduct
} from "../controller/productControl.js";

const router = express.Router()

router.post("/", createProduct)
router.get("/:id", getAProduct)

export default router;
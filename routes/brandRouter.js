import express from "express";
import {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand,
} from "../controller/brandController.js"
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createBrand)
router.get("/", getAllBrand);
router.get("/:id", getBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand)
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)

export default router;

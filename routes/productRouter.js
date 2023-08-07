import express from "express";
import { 
    createProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages,
} from "../controller/productControl.js";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImages.js";

const router = express.Router()

router.post("/", authMiddleware, isAdmin, createProduct)
router.put(
    "/upload/:id", 
    authMiddleware, 
    isAdmin, 
    /*array of images that can be uploaded max of 10 */
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
);
router.put("/wishlist", authMiddleware, isAdmin, addToWishlist)
router.put("/rating", authMiddleware, rating)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)
export default router;
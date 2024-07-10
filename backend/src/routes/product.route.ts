import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  // generateProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getLatestProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(isAdmin, upload.single("photo"), createProduct);

router.route("/latest").get(getLatestProducts);

router.route("/all").get(getAllProducts);

router.route("/categories").get(getAllCategories);

router.route("/admin-products").get(isAdmin, getAdminProducts);

// router.route("/generate").get(generateProduct)

router
  .route("/:id")
  .get(getSingleProduct)
  .put(isAdmin, upload.single("photo"), updateProduct)
  .delete(isAdmin, deleteProduct);

export default router;

import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addNewVariant,
  updateVariant,
  deleteVariant,
  getProductBySlug,
} from "../controller/productController";

const router = express.Router();

router.route("/")
  .get(getAllProducts)
  .post(createProduct);

router.get("/slug/:slug", getProductBySlug);

router.route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.route("/:id/variants")
  .post(addNewVariant);

router.route("/:id/variants/:variantId")
  .patch(updateVariant)
  .delete(deleteVariant);

export default router;

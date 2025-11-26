import express from "express";
import {
  getAllVariants,
  getVariant,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantsByProduct           // ← new
} from "../controller/variantsController";

const router = express.Router();

router
  .route("/")
  .get(getAllVariants)
  .post(createVariant);

router
  .route("/product/:productId")  // ← new
  .get(getVariantsByProduct);

router
  .route("/:id")
  .get(getVariant)
  .patch(updateVariant)
  .delete(deleteVariant);

export const VariantRouter = router;
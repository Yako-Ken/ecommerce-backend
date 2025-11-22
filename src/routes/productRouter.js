"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
router.route("/")
    .get(productController_1.getAllProducts)
    .post(productController_1.createProduct);
router.get("/slug/:slug", productController_1.getProductBySlug);
router.route("/:id")
    .get(productController_1.getProduct)
    .patch(productController_1.updateProduct)
    .delete(productController_1.deleteProduct);
router.route("/:id/variants")
    .post(productController_1.addNewVariant);
router.route("/:id/variants/:variantId")
    .patch(productController_1.updateVariant)
    .delete(productController_1.deleteVariant);
exports.default = router;

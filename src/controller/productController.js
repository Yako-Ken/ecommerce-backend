"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVariant = exports.updateVariant = exports.addNewVariant = exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.getProductBySlug = exports.getProduct = exports.createProduct = void 0;
const productModel_1 = require("../models/productModel");
const catchError_1 = require("../utils/catchError");
const factoryController_1 = require("./factoryController");
const AppError_1 = __importDefault(require("../utils/AppError"));
exports.createProduct = (0, factoryController_1.createEntitiy)(productModel_1.Product);
exports.getProduct = (0, factoryController_1.getEntitiy)(productModel_1.Product, { path: "variants" });
exports.getProductBySlug = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const product = yield productModel_1.Product.findOne({ slug }).populate("variants");
    if (!product) {
        return next(new AppError_1.default("No product found with this slug", 404));
    }
    res.status(200).json({
        status: "success",
        data: product,
    });
}));
exports.getAllProducts = (0, factoryController_1.getAllEntitiy)(productModel_1.Product);
exports.updateProduct = (0, factoryController_1.updateEntitiy)(productModel_1.Product);
exports.deleteProduct = (0, factoryController_1.deleteEntitiy)(productModel_1.Product);
exports.addNewVariant = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield productModel_1.Product.findByIdAndUpdate(id, { $push: { variants: req.body } }, { runValidators: true, new: true }).populate("variants");
    if (!product) {
        return next(new AppError_1.default("No product found with this id", 404));
    }
    res.status(200).json({ data: product, message: "Variant added successfully!" });
}));
exports.updateVariant = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, variantId } = req.params;
    const updatedProduct = yield productModel_1.Product.findOneAndUpdate({ _id: id, "variants._id": variantId }, { $set: { "variants.$": req.body } }, { runValidators: true, new: true }).populate("variants");
    if (!updatedProduct) {
        return next(new AppError_1.default("No product or variant found with this ID", 404));
    }
    res.status(200).json({
        data: { product: updatedProduct },
        message: "Variant updated successfully!",
    });
}));
exports.deleteVariant = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.Product.findByIdAndUpdate(req.params.id, { $pull: { variants: { _id: req.params.variantId } } }, { new: true }).populate("variants");
    if (!product) {
        return next(new AppError_1.default("No product found with this id", 404));
    }
    res.status(204).json({ message: "Successfully deleted", data: { product } });
}));

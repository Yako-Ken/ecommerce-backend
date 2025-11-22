import { Request, Response, NextFunction } from "express";
import { Product } from "../models/productModel";
import { catchError } from "../utils/catchError";
import { getAllEntitiy, getEntitiy, createEntitiy, updateEntitiy, deleteEntitiy } from "./factoryController";
import AppError from "../utils/AppError";

export const createProduct = createEntitiy(Product);

export const getProduct = getEntitiy(Product, { path: "variants" });

export const getProductBySlug = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug }).populate("variants");

  if (!product) {
    return next(new AppError("No product found with this slug", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

export const getAllProducts = getAllEntitiy(Product);

export const updateProduct = updateEntitiy(Product);

export const deleteProduct = deleteEntitiy(Product);

export const addNewVariant = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { $push: { variants: req.body } },
    { runValidators: true, new: true }
  ).populate("variants");

  if (!product) {
    return next(new AppError("No product found with this id", 404));
  }
  res.status(200).json({ data: product, message: "Variant added successfully!" });
});

export const updateVariant = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id, variantId } = req.params;
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id, "variants._id": variantId },
    { $set: { "variants.$": req.body } },
    { runValidators: true, new: true }
  ).populate("variants");

  if (!updatedProduct) {
    return next(new AppError("No product or variant found with this ID", 404));
  }

  res.status(200).json({
    data: { product: updatedProduct },
    message: "Variant updated successfully!",
  });
});

export const deleteVariant = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $pull: { variants: { _id: req.params.variantId } } },
    { new: true }
  ).populate("variants");

  if (!product) {
    return next(new AppError("No product found with this id", 404));
  }
  res.status(204).json({ message: "Successfully deleted", data: { product } });
});

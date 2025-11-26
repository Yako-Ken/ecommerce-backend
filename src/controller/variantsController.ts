import { Variant } from "../models/VariantsModel";
import {
  createEntitiy,
  deleteEntitiy,
  getAllEntitiy,
  getEntitiy,
  updateEntitiy
} from "./factoryController";
import { NextFunction, Request, Response } from "express";

// generic methods
export const createVariant   = createEntitiy(Variant);
export const getVariant      = getEntitiy(Variant);
export const getAllVariants  = getAllEntitiy(Variant);
export const updateVariant   = updateEntitiy(Variant);
export const deleteVariant   = deleteEntitiy(Variant);

// مخصص للـ productId
export const getVariantsByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const variants = await Variant.find({ productId }); // أو أى اسم field فـ الـ schema
    res.status(200).json({
      status: "success",
      results: variants.length,
      data: { variants }
    });
  } catch (err) {
    next(err);
  }
};
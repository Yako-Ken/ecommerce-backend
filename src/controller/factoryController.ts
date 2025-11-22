// src/controllers/factoryController.ts

import { Model, Document, PopulateOptions } from "mongoose";
import AppError from "../utils/AppError";
import { catchError } from "../utils/catchError";
import { Request, Response, NextFunction } from "express";
import APIFeatures from "../utils/APIFeatures";

export const createEntitiy = <T extends Document>(Model: Model<T>) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: { doc } });
  });

export const getEntitiy = <T extends Document>(
  Model: Model<T>,
  popOptions?: PopulateOptions | PopulateOptions[]
) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });

// --- التعديل هنا ---
export const getAllEntitiy = <T extends Document>(Model: Model<T>) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    // لقد قمنا بإزالة .limitFields() من السلسلة
    const features = new APIFeatures(Model.find(), req.query).filter().sort().paginate();
    const docs = await features.query;
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: { docs },
    });
  });
// --------------------

export const updateEntitiy = <T extends Document>(Model: Model<T>) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!doc) {
      return next(new AppError("No document found with this id", 404));
    }
    res.status(200).json({ status: "success", data: { doc } });
  });

export const deleteEntitiy = <T extends Document>(Model: Model<T>) =>
  catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError("No document found with this id", 404));
    }
    res.status(204).json({ status: "success", data: null });
  });

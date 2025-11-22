import { Request, Response, NextFunction } from "express";
import { Category } from "../models/Category";
import { catchError } from "../utils/catchError";
import AppError from "../utils/AppError";
import ImageKit from "imagekit";
import {
  getAllEntitiy,
  getEntitiy,
  deleteEntitiy,
} from "./factoryController";

// --- إعداد ImageKit ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// --- دوال Factory التي لا تحتاج إلى تعديل ---
export const getAllCategory = getAllEntitiy(Category);
export const getCategory = getEntitiy(Category);
export const deleteCategory = deleteEntitiy(Category);

// --- دالة مخصصة لإنشاء فئة مع صورة ---
export const createCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
  // تحقق من وجود ملف مرفق
  if (req.file) {
    // رفع الملف إلى ImageKit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/ecommerce/categories", // اسم المجلد في ImageKit
    });

    // إضافة معلومات الصورة إلى جسم الطلب
    req.body.image = {
      secure_url: response.url,
      public_id: response.fileId,
    };
  }

  // إنشاء المستند في قاعدة البيانات
  const doc = await Category.create(req.body);
  res.status(201).json({ status: "success", data: doc });
});

// --- دالة مخصصة لتحديث فئة مع صورة ---
export const updateCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // إذا كان هناك ملف جديد مرفق، قم برفعه وتحديث معلومات الصورة
  if (req.file) {
    // يمكنك هنا إضافة منطق لحذف الصورة القديمة من ImageKit إذا أردت
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/ecommerce/categories",
    });

    req.body.image = {
      secure_url: response.url,
      public_id: response.fileId,
    };
  }

  // تحديث المستند في قاعدة البيانات
  const doc = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({ status: "success", data: doc });
});

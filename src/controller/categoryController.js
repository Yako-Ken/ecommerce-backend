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
exports.updateCategory = exports.createCategory = exports.deleteCategory = exports.getCategory = exports.getAllCategory = void 0;
const Category_1 = require("../models/Category");
const catchError_1 = require("../utils/catchError");
const AppError_1 = __importDefault(require("../utils/AppError"));
const imagekit_1 = __importDefault(require("imagekit"));
const factoryController_1 = require("./factoryController");
// --- إعداد ImageKit ---
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
// --- دوال Factory التي لا تحتاج إلى تعديل ---
exports.getAllCategory = (0, factoryController_1.getAllEntitiy)(Category_1.Category);
exports.getCategory = (0, factoryController_1.getEntitiy)(Category_1.Category);
exports.deleteCategory = (0, factoryController_1.deleteEntitiy)(Category_1.Category);
// --- دالة مخصصة لإنشاء فئة مع صورة ---
exports.createCategory = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // تحقق من وجود ملف مرفق
    if (req.file) {
        // رفع الملف إلى ImageKit
        const response = yield imagekit.upload({
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
    const doc = yield Category_1.Category.create(req.body);
    res.status(201).json({ status: "success", data: doc });
}));
// --- دالة مخصصة لتحديث فئة مع صورة ---
exports.updateCategory = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // إذا كان هناك ملف جديد مرفق، قم برفعه وتحديث معلومات الصورة
    if (req.file) {
        // يمكنك هنا إضافة منطق لحذف الصورة القديمة من ImageKit إذا أردت
        const response = yield imagekit.upload({
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
    const doc = yield Category_1.Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new AppError_1.default("No document found with that ID", 404));
    }
    res.status(200).json({ status: "success", data: doc });
}));

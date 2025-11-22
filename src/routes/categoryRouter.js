"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controller/categoryController");
const multer_1 = __importDefault(require("multer")); // <-- 1. استيراد multer
const router = express_1.default.Router();
// 2. إعداد Multer لتخزين الملف في ذاكرة الخادم مؤقتًا
// هذا يسمح لنا بالوصول إلى الملف كـ "buffer" لإرساله إلى ImageKit
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// --- تعديل المسارات التي تحتاج إلى رفع صور ---
router.route("/")
    .get(categoryController_1.getAllCategory)
    // 3. إضافة middleware الرفع قبل دالة التحكم
    // .single("image") تعني أننا نتوقع ملفًا واحدًا في حقل يسمى "image"
    .post(upload.single("image"), categoryController_1.createCategory);
router.route("/:id")
    .get(categoryController_1.getCategory)
    // 4. إضافة middleware الرفع هنا أيضًا
    .patch(upload.single("image"), categoryController_1.updateCategory)
    .delete(categoryController_1.deleteCategory);
// قمت بتغيير اسم التصدير ليكون default export وهو الأكثر شيوعًا
exports.default = router;

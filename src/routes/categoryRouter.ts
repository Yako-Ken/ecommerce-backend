import express from "express";
import {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController";
import multer from "multer"; // <-- 1. استيراد multer

const router = express.Router();

// 2. إعداد Multer لتخزين الملف في ذاكرة الخادم مؤقتًا
// هذا يسمح لنا بالوصول إلى الملف كـ "buffer" لإرساله إلى ImageKit
const upload = multer({ storage: multer.memoryStorage() });

// --- تعديل المسارات التي تحتاج إلى رفع صور ---

router.route("/")
  .get(getAllCategory)
  // 3. إضافة middleware الرفع قبل دالة التحكم
  // .single("image") تعني أننا نتوقع ملفًا واحدًا في حقل يسمى "image"
  .post(upload.single("image"), createCategory);

router.route("/:id")
  .get(getCategory)
  // 4. إضافة middleware الرفع هنا أيضًا
  .patch(upload.single("image"), updateCategory)
  .delete(deleteCategory);

// قمت بتغيير اسم التصدير ليكون default export وهو الأكثر شيوعًا
export default router; 

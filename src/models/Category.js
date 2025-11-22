"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify")); // <-- 1. استيراد المكتبة
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"], // من الأفضل إضافة رسالة خطأ
        trim: true,
    },
    slug: {
        type: String,
        unique: true, // Slug يجب أن يكون فريدًا
    },
    description: String,
    image: { secure_url: String, publicId: String },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// --- 2. إضافة Middleware لإنشاء Slug تلقائيًا ---
// هذا الكود سيتم تشغيله "قبل" حفظ أي مستند جديد أو تحديثه
categorySchema.pre("save", function (next) {
    // `this` يشير إلى المستند الذي سيتم حفظه
    if (this.isModified("name") || this.isNew) {
        this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true, trim: true });
    }
    next();
});
exports.Category = (0, mongoose_1.model)("Category", categorySchema);

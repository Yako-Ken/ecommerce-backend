import { Schema, model, Document, Types } from "mongoose";
import slugify from "slugify"; // <-- 1. استيراد المكتبة

interface IOption {
  name: string;
  values: string[];
}

// قمت بتعديل الواجهة لتطابق المخطط بشكل أفضل
interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: {
    secure_url: string;
    publicId: string;
  };
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
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
  },
  {
    timestamps: true,
  }
);

// --- 2. إضافة Middleware لإنشاء Slug تلقائيًا ---
// هذا الكود سيتم تشغيله "قبل" حفظ أي مستند جديد أو تحديثه
categorySchema.pre<ICategory>("save", function (next) {
  // `this` يشير إلى المستند الذي سيتم حفظه
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  next();
});

export const Category = model<ICategory>("Category", categorySchema);

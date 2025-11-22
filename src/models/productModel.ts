import { Schema, model, Document, Types, Query } from "mongoose";

interface IVariantOption {
  name: string;
  value: string;
}

interface IVariant {
  options: IVariantOption[];
  images: { secure_url: string; publicId: string }[];
  price: number;
  inventory: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  images: { secure_url: string; publicId: string }[];
  price: number;
  discount?: number;
  category: Types.ObjectId;
  brand?: string;
  gender?: "male" | "female" | "kids";
  variants: IVariant[];
  totalInventory: number; // ✅ 1. أضف الحقل الافتراضي هنا
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true, minlength: 10 },
    shortDesc: { type: String },
    images: {
      type: [
        {
          secure_url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      required: true,
      validate: [(val: any[]) => val.length > 0, "At least one main image is required."],
    },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String },
    gender: { type: String, enum: ["male", "female", "kids"] },
    variants: [
      {
        _id: false,
        options: {
          type: [{ _id: false, name: String, value: String }],
          required: true,
        },
        images: {
          type: [
            {
              _id: false,
              secure_url: { type: String, required: true },
              publicId: { type: String, required: true },
            },
          ],
          validate: [(val: any[]) => val.length > 0, "At least one variant image is required."],
        },
        price: { type: Number, required: true, min: 0 },
        inventory: { type: Number, required: true, min: 0 },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ 2. تعريف الحقل الافتراضي
productSchema.virtual("totalInventory").get(function () {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((total, variant) => total + variant.inventory, 0);
  }
  return 0;
});

productSchema.pre<Query<IProduct, Document<IProduct>>>("find", function (next) {
  this.populate("category");
  next();
});

productSchema.pre<Query<IProduct, Document<IProduct>>>("findOne", function (next) {
  this.populate("category");
  next();
});

export const Product = model<IProduct>("Product", productSchema);

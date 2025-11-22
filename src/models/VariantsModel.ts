// src/models/variantModel.ts

import mongoose, { model, Schema, Document } from "mongoose"; // 1. استيراد `Document`

// 2. تعديل الواجهة لترث من `Document`
export interface IVariant extends Document {
  name: string;
  options: string[]; // 3. تعديل النوع ليكون مصفوفة من النصوص
}

const variantSchema = new Schema<IVariant>(
  {
    name: { 
      type: String, 
      required: [true, "Variant name is required."], 
      unique: true 
    },
    options: {
      type: [String], // 4. تعديل نوع المخطط ليكون مصفوفة من النصوص
      required: [true, "Variant options are required."],
    },
  },
  { timestamps: true }
);

export const Variant = model<IVariant>("Variant", variantSchema);

"use strict";
// src/models/variantModel.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
const mongoose_1 = require("mongoose"); // 1. استيراد `Document`
const variantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Variant name is required."],
        unique: true
    },
    options: {
        type: [String], // 4. تعديل نوع المخطط ليكون مصفوفة من النصوص
        required: [true, "Variant options are required."],
    },
}, { timestamps: true });
exports.Variant = (0, mongoose_1.model)("Variant", variantSchema);

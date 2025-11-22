"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
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
        validate: [(val) => val.length > 0, "At least one main image is required."],
    },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
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
                validate: [(val) => val.length > 0, "At least one variant image is required."],
            },
            price: { type: Number, required: true, min: 0 },
            inventory: { type: Number, required: true, min: 0 },
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ✅ 2. تعريف الحقل الافتراضي
productSchema.virtual("totalInventory").get(function () {
    if (this.variants && this.variants.length > 0) {
        return this.variants.reduce((total, variant) => total + variant.inventory, 0);
    }
    return 0;
});
productSchema.pre("find", function (next) {
    this.populate("category");
    next();
});
productSchema.pre("findOne", function (next) {
    this.populate("category");
    next();
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);

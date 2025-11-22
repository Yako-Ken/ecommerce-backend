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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const imagekit_1 = require("../utils/imagekit");
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file found" });
            return;
        }
        const uploaded = yield imagekit_1.imagekit.upload({
            file: req.file.buffer.toString("base64"),
            fileName: `${Date.now()}-${req.file.originalname}`,
        });
        res.json({
            url: uploaded.url,
            fileId: uploaded.fileId,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Upload failed" });
    }
});
exports.uploadImage = uploadImage;
const deleteImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            res.status(400).json({ message: "fileId is required" });
            return;
        }
        yield imagekit_1.imagekit.deleteFile(fileId);
        res.json({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete image" });
    }
});
exports.deleteImage = deleteImage;

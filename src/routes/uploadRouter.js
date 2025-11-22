"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../controller/uploadController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post("/", upload.single("image"), uploadController_1.uploadImage);
router.delete("/:fileId", uploadController_1.deleteImage);
exports.uploadRouter = router;

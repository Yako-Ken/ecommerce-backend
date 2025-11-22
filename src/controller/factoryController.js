"use strict";
// src/controllers/factoryController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntitiy = exports.updateEntitiy = exports.getAllEntitiy = exports.getEntitiy = exports.createEntitiy = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const catchError_1 = require("../utils/catchError");
const APIFeatures_1 = __importDefault(require("../utils/APIFeatures"));
const createEntitiy = (Model) => (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(201).json({ status: "success", data: { doc } });
}));
exports.createEntitiy = createEntitiy;
const getEntitiy = (Model, popOptions) => (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let query = Model.findById(id);
    if (popOptions) {
        query = query.populate(popOptions);
    }
    const doc = yield query;
    if (!doc) {
        return next(new AppError_1.default("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: { doc },
    });
}));
exports.getEntitiy = getEntitiy;
// --- التعديل هنا ---
const getAllEntitiy = (Model) => (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // لقد قمنا بإزالة .limitFields() من السلسلة
    const features = new APIFeatures_1.default(Model.find(), req.query).filter().sort().paginate();
    const docs = yield features.query;
    res.status(200).json({
        status: "success",
        results: docs.length,
        data: { docs },
    });
}));
exports.getAllEntitiy = getAllEntitiy;
// --------------------
const updateEntitiy = (Model) => (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!doc) {
        return next(new AppError_1.default("No document found with this id", 404));
    }
    res.status(200).json({ status: "success", data: { doc } });
}));
exports.updateEntitiy = updateEntitiy;
const deleteEntitiy = (Model) => (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield Model.findByIdAndDelete(id);
    if (!doc) {
        return next(new AppError_1.default("No document found with this id", 404));
    }
    res.status(204).json({ status: "success", data: null });
}));
exports.deleteEntitiy = deleteEntitiy;

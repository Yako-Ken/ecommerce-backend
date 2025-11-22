"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.route("/").post(authController_1.protect, authController_1.checkIfAdmin, userController_1.createUser).get(userController_1.getAllUsers);
router.route("/:id").patch(userController_1.updateUser).delete(userController_1.deleteUser).get(userController_1.getUser);
exports.userRouter = router;

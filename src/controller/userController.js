"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = require("../models/userModel");
const factoryController_1 = require("./factoryController");
exports.getAllUsers = (0, factoryController_1.getAllEntitiy)(userModel_1.User);
exports.getUser = (0, factoryController_1.getEntitiy)(userModel_1.User);
exports.createUser = (0, factoryController_1.createEntitiy)(userModel_1.User);
exports.updateUser = (0, factoryController_1.updateEntitiy)(userModel_1.User);
exports.deleteUser = (0, factoryController_1.deleteEntitiy)(userModel_1.User);
// export const getAllUsers = catchError(async (req: Request, res: Response, next: NextFunction) => {
//   const userFeatures = new APIFeatures(User.find(), req.query).paginate().filter().sort().limitFields();
//   const allusers = await userFeatures.query;
//   res.status(200).json({ data: { allusers } });
// });
// export const getuser = catchError(async (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;
//   const user = await User.findById(id);
//   res.status(200).json({ data: { user } });
// });
// export const createUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
//   const userData = req.body;
//   const newUser = await User.create(req.body);
//   res.status(200).json({ message: "user created successfuuly", data: { newUser } });
// });
// export const updateUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
//   const data = req.body;
//   const { id } = req.params;
//   const user = await User.findByIdAndUpdate(id, data, { new: true });
//   res.status(200).json({ data: { user } });
// });
// export const deleteUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;
//   const user = await User.findByIdAndDelete(id);
//   res.status(200).json({ message: "succsessfully deleted" });
// });

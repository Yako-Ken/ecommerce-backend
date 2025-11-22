import { Router } from "express";
import multer from "multer";
import { deleteImage, uploadImage } from "../controller/uploadController";

const router = Router();
const upload = multer();

router.post("/", upload.single("image"), uploadImage);
router.delete("/:fileId", deleteImage);


export const uploadRouter = router;

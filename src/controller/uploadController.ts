import { Request, Response, NextFunction } from "express";
import { imagekit } from "../utils/imagekit";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file found" });
      return;
    }

    const uploaded = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `${Date.now()}-${req.file.originalname}`,
    });

    res.json({
      url: uploaded.url,
      fileId: uploaded.fileId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      res.status(400).json({ message: "fileId is required" });
      return;
    }

    await imagekit.deleteFile(fileId);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

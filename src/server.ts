import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const DB_URI = process.env.DATABASE_URI || "";

mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("DB Connection Error:", err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

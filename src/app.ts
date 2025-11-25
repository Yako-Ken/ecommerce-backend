import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors"; // <-- (1) استيراد CorsOptions

import globalErrorHandler from "./controller/errorController";
import AppError from "./utils/AppError";
import { userRouter } from "./routes/userRouter";
import { authRouter } from "./routes/authRouter";
import productRouter from "./routes/productRouter";
import CategoryRouter from "./routes/categoryRouter";
import { uploadRouter } from "./routes/uploadRouter";
import { VariantRouter } from "./routes/variantsRouter";
import { OrderRouter } from "./routes/orderRouter";

const app = express();

const allowedOrigins = [
  'https://webtest-2.vercel.app',
  'http://localhost:3000'
];

// (2 ) تحديد نوع corsOptions ليكون CorsOptions
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // (3) تحديد أنواع origin و callback
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/categories", CategoryRouter);
app.use("/upload", uploadRouter);
app.use("/variants", VariantRouter);
app.use("/orders", OrderRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;

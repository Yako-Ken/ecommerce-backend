"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorController_1 = __importDefault(require("./controller/errorController"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const userRouter_1 = require("./routes/userRouter");
const authRouter_1 = require("./routes/authRouter");
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const categoryRouter_1 = __importDefault(require("./routes/categoryRouter"));
const uploadRouter_1 = require("./routes/uploadRouter");
const variantsRouter_1 = require("./routes/variantsRouter");
const app = (0, express_1.default)();
/**
 * Purpose: Sets up the web server to handle requests and responses.
 * Features:
 * - Provides routing for different endpoints.
 * - Integrates middlewares to enhance functionality, security, and debugging.
 * Example:
 * - Handles an incoming `GET /` request and sends a response.
 */
// Middleware Setup
app.use((0, helmet_1.default)());
/**
 * Middleware: helmet
 * Purpose: Enhances security by setting appropriate HTTP headers.
 * Features:
 * - Prevents common vulnerabilities like XSS, clickjacking, and MIME sniffing.
 * Example:
 * - Adds the `X-Content-Type-Options: nosniff` header to prevent browsers from interpreting files as a different MIME type.
 * Usage:
 * - Automatically secures your API with default settings.
 */
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
/**
 * Middleware: morgan
 * Purpose: Logs HTTP requests for debugging and monitoring purposes.
 * Modes:
 * - "dev": Provides concise colored logs for development.
 * - "combined": Detailed logs for production, including timestamps and response statuses.
 * Example:
 * - Logs: "GET /home 200 5.432 ms - 13"
 */
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
/**
 * Middleware: express.json()
 * Purpose: Parses incoming JSON payloads in requests.
 * Features:
 * - Restricts payload size to 10kb to prevent Denial of Service (DoS) attacks.
 * Example:
 * - Incoming request: `{ "name": "John" }`
 * - Accessible in code: `req.body.name === "John"`
 */
app.use(express_1.default.urlencoded({ extended: false }));
/**
 * Middleware: express.urlencoded()
 * Purpose: Parses incoming URL-encoded payloads, such as form submissions.
 * Features:
 * - Handles data like `name=John&age=30`.
 * - With `extended: false`, only supports simple objects, not nested ones.
 * Example:
 * - Incoming form: `<form><input name="name" value="John"></form>`
 * - Accessible in code: `req.body.name === "John"`
 */
app.use((0, cookie_parser_1.default)());
/**
 * Middleware: cookieParser
 * Purpose: Parses cookies from incoming requests.
 * Use Case:
 * - Essential for authentication and session management.
 * Example:
 * - Incoming header: `Cookie: userId=12345`
 * - Accessible in code: `req.cookies.userId === "12345"`
 */
app.use((0, express_mongo_sanitize_1.default)());
/**{
  "username": { "$gt": "" },
  "password": "anyPassword"
}
This matches any user in the database because $gt bypasses the need for a specific username.

 * Middleware: express-mongo-sanitize
 * Purpose: Prevents NoSQL Injection attacks.
 * How It Works:
 * - Strips out `$` and `.` from request data to avoid malicious MongoDB queries.
 * Example:
 * - Malicious input: `{ "$gt": "" }`
 * - Sanitized output: `{ }`
 */
app.use((0, xss_clean_1.default)());
/**
 * Middleware: xss-clean
 * Purpose: Protects against Cross-Site Scripting (XSS) attacks.
 * How It Works:
 * - Sanitizes input to prevent injection of malicious scripts.
 * Example:
 * - Malicious input: `<script>alert('Hacked!')</script>`
 * - Sanitized output: `alert('Hacked!')`
 */
app.use((0, cors_1.default)({ credentials: true, origin: true }));
/**
 * Middleware: cors
 * Purpose: Enables Cross-Origin Resource Sharing (CORS).
 * Use Case:
 * - Allows your API to handle requests from other domains securely.
 * Options:
 * - `credentials: true`: Supports cookies and authentication headers across domains.
 * - `origin: true`: Dynamically allows all origins.
 * Example:
 * - Frontend hosted on `http://example.com` can access API on `http://api.example.com`.
 */
app.use((req, res, next) => {
    console.log(req.url);
    next();
});
/**
 * Middleware: Request Logger
 * Purpose: Logs the URL of every incoming request.
 * Example:
 * - Request: `GET /home`
 * - Logs: `/home`
 */
app.use("/auth", authRouter_1.authRouter);
app.use("/user", userRouter_1.userRouter);
app.use("/products", productRouter_1.default);
app.use("/categories", categoryRouter_1.default); // ✅ تم التغيير إلى صيغة الجمع
app.use("/upload", uploadRouter_1.uploadRouter);
app.use("/variants", variantsRouter_1.VariantRouter);
app.all("*", (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
/**
 * Middleware: Catch-All Route Handler
 * Purpose: Handles requests to undefined routes.
 * Features:
 * - Logs the requested URL.
 * - Sends a 404 JSON response with an error message.
 * Example:
 * - Request: `GET /unknown`
 * - Logs: `/unknown`
 * - Response: `{ "message": "Can't find /unknown on this server", "status": 404 }`
 */
/*
When an error occurs in the application,
Express.js will automatically call the next middleware function in the chain that has four arguments.
Note that this middleware will only catch errors that occur in the application after it's been added to the middleware chain.
If an error occurs before this middleware is added, it will not be caught by this middleware.
*/
app.use(errorController_1.default);
exports.default = app;
/**
 * Error Handling Middleware
 * Note:
 * - Errors occurring after this point can be caught and processed by error-handling middleware.
 * - Example: If an uncaught error occurs, it will propagate to a middleware designed to handle it.
 */

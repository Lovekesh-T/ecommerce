import express from "express";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import NodeCache from "node-cache";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import dashboardRoutes from "./routes/stats.route.js";
import morgan from "morgan";

import cors from "cors";

export const myCache = new NodeCache();

const app = express();

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/vi/dashboard", dashboardRoutes);

app.use(errorMiddleware);

export default app;

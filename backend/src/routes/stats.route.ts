import express from "express";

import { isAdmin } from "../middlewares/auth.middleware.js";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/stats", isAdmin, getDashboardStats);

router.get("/pie", isAdmin, getPieCharts);

router.get("/bar", isAdmin, getBarCharts);

router.get("/line", isAdmin, getLineCharts);

export default router;

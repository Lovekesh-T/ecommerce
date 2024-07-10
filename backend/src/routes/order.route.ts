import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/new").post(newOrder);

router.route("/my").get(myOrders);

router.route("/all").get(isAdmin, allOrders);

router
  .route("/:id")
  .get(getSingleOrder)
  .put(isAdmin, processOrder)
  .delete(isAdmin, deleteOrder);

export default router;

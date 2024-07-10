import express from "express";
import {
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  getAllCoupons,
  newCoupon,
} from "../controllers/payment.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/create").post(createPaymentIntent);

router.route("/coupon/all").get(isAdmin, getAllCoupons);

router.route("/coupon/new").post(isAdmin, newCoupon);

router.route("/discount").post(applyDiscount);

router.route("/coupon/:id").delete(isAdmin, deleteCoupon);

export default router;

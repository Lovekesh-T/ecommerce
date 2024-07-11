import { stripe } from "../index.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncError } from "../utils/asyncError.js";


export const createPaymentIntent = asyncError(async (req, res) => {
  const { amount } = req.body;

  if (!amount) throw new ApiError(400, "Please enter amount");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  res
    .status(200)
    .json(
      new ApiResponse(201, "payment success", {
        clientSecret: paymentIntent.client_secret,
      })
    );
});

// create new coupon
export const newCoupon = asyncError(async (req, res) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    throw new ApiError(400, "Please enter both coupon and amount");

  await Coupon.create({ code: coupon, amount });

  res
    .status(200)
    .json(new ApiResponse(201, `Coupon: ${coupon} created successfully`));
});

export const applyDiscount = asyncError(async (req, res) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) throw new ApiError(400, "Invalid Coupon");

  res.status(200).json(new ApiResponse(200, "", { discount: discount.amount }));
});

export const getAllCoupons = asyncError(async (req, res) => {
  const coupons = await Coupon.find();

  res
    .status(200)
    .json(new ApiResponse(200, "Coupons fetched successfully", coupons));
});

export const deleteCoupon = asyncError(async (req, res) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new ApiError(400, "Invalid Coupon Id");

  res
    .status(200)
    .json(new ApiResponse(200, `Coupon ${coupon.code} deleted successfully`));
});

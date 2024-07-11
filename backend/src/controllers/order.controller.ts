import { Request, Response } from "express";
import { asyncError } from "../utils/asyncError.js";
import { NewOrderRequestBody } from "../types/type.js";
import { Order } from "../models/order.model.js";
import { reduceStock } from "../utils/reduceStock.js";
import { invalidateCache } from "../utils/invalidateCache.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { myCache } from "../app.js";

// create new order
export const newOrder = asyncError(
  async (req: Request<{}, {}, NewOrderRequestBody>, res: Response) => {
    const {
      shippingInfo,
      user,
      total,
      subTotal,
      tax,
      discount,
      shippingCharges,
      orderItems,
    } = req.body;
    if (
      [
        shippingInfo,
        user,
        total,
        subTotal,
        tax,
        shippingCharges,
        orderItems,
      ].some((field) => {
        console.log(field === undefined);
        return field === undefined;
      })
    ) {
      throw new ApiError(400, "All fields are required");

      }
    const order = await Order.create({
      shippingInfo,
      user,
      total,
      subTotal,
      tax,
      discount,
      shippingCharges,
      orderItems,
    });
    await reduceStock(orderItems);
    
     invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Order Placed successfully"));
}
)

//my orders

export const myOrders = asyncError(async (req, res) => {
  const { id: user } = req.query;

  let orders = [];
  const key = `myOrders-${user}`;

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// all orders
export const allOrders = asyncError(async (req, res) => {
  let orders = [];
  const key = "allOrders";
  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find().populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// get single order
export const getSingleOrder = asyncError(async (req, res) => {
  const { id } = req.params;
  let order;
  const key = `order-${id}`;
  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) throw new ApiError(404, "Order not found");
    myCache.set(key, JSON.stringify(order));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Order fetched successfully", order));
});

// process order
export const processOrder = asyncError(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) throw new ApiError(404, "Order not found");

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;

    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await order.save({ validateBeforeSave: false });

   invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Order Processed successfully"));
});

//delete order
export const deleteOrder = asyncError(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) throw new ApiError(404, "Order not found");

  await order.deleteOne();

  
   invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Order Deleted successfully"));
});

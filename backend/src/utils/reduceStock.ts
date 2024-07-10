import { Product } from "../models/product.model.js";
import { OrderItems } from "../types/type.js";
import { ApiError } from "./apiError.js";

export const reduceStock = async (orderItems: OrderItems[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(orderItems[i].productId);
    if (!product) throw new ApiError(404, "Product not found");
    product.stock -= order.quantity;
    await product.save({ validateBeforeSave: false });
  }
};

import { myCache } from "../app.js";
import { InvalidateCacheType } from "../types/type.js";

export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
      `product-${productId}`,
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    myCache.del(productKeys);

    if (typeof productId === "object") {
      productId.forEach((id) => productKeys.push(`product-${id}`));
    }
  }
  if (order) {
    let orderKeys: string[] = [
      "allOrders",
      `myOrders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};

import { myCache } from "../app.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncError } from "../utils/asyncError.js";
import {
  calculatePercentage,
  getChartData,
  getInventories,
} from "../utils/feature.js";

export const getDashboardStats = asyncError(async (req, res) => {
  let stats;

  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    // Products promise
    const thisMonthProductsPromise = Product.find({
      createdAt: { $lte: thisMonth.end, $gte: thisMonth.start },
    });
    const lastMonthProductsPromise = Product.find({
      createdAt: { $lte: lastMonth.end, $gte: lastMonth.start },
    });

    // User Promise
    const thisMonthUsersPromise = User.find({
      createdAt: { $lte: thisMonth.end, $gte: thisMonth.start },
    });
    const lastMonthUsersPromise = User.find({
      createdAt: { $lte: lastMonth.end, $gte: lastMonth.start },
    });

    // Order Promise
    const thisMonthOrdersPromise = Order.find({
      createdAt: { $lte: thisMonth.end, $gte: thisMonth.start },
    });
    const lastMonthOrdersPromise = Order.find({
      createdAt: { $lte: lastMonth.end, $gte: lastMonth.start },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $lte: today,
        $gte: sixMonthsAgo,
      },
    });

    const categoriesCountPromise = Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const latestTransactionsPromise = Order.aggregate([
      {
        $addFields: {
          quantity: { $size: "$orderItems" },
        },
      },
      {
        $project: {
          status: 1,
          quantity: 1,
          discount: 1,
          total: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);

    const [
      thisMonthProducts,
      lastMonthProducts,
      thisMonthUsers,
      lastMonthUsers,
      thisMonthOrders,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categoriesCount,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      lastMonthProductsPromise,
      thisMonthUsersPromise,
      lastMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find().select("total"),
      lastSixMonthOrdersPromise,
      getInventories(),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce((acc, order) => {
      return acc + (order.total || 0);
    }, 0);

    const lastMonthRevenue = lastMonthOrders.reduce((acc, order) => {
      return acc + (order.total || 0);
    }, 0);

    const revenueChangePercent = calculatePercentage(
      thisMonthRevenue,
      lastMonthRevenue
    );

    const productChangePercent = calculatePercentage(
      thisMonthProducts.length,
      lastMonthProducts.length
    );
    const userChangePercent = calculatePercentage(
      thisMonthUsers.length,
      lastMonthUsers.length
    );
    const orderChangePercent = calculatePercentage(
      thisMonthOrders.length,
      lastMonthOrders.length
    );

    const revenue = allOrders.reduce((acc, order) => {
      return acc + (order.total || 0);
    }, 0);

    const count = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };

    const changePercent = {
      product: productChangePercent,
      user: userChangePercent,
      order: orderChangePercent,
      revenue: revenueChangePercent,
    };

    const orderMonthCounts = getChartData({
      length: 6,
      docArr: lastSixMonthOrders,
      today,
    });
    const orderMonthlyRevenue = getChartData({
      length: 6,
      docArr: lastSixMonthOrders,
      today,
      property: "total",
    });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    stats = {
      categoriesCount,
      count,
      changePercent,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthlyRevenue,
      },
      userRatio,
      latestTransactions,
    };
  }

  myCache.set("admin-stats", JSON.stringify(stats));

  res
    .status(200)
    .json(new ApiResponse(200, "Dashboard stats fetched successfully", stats));
});

//
export const getPieCharts = asyncError(async (req, res) => {
  let charts;

  if (myCache.has("admin-pie-charts"))
    charts = JSON.parse(myCache.get("admin-pie-charts")!);
  else {
    const categoriesCountPromise = Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      productCategories,
      productsCount,
      productOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      getInventories(),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Order.find({}).select([
        "total",
        "discount",
        "subTotal",
        "tax",
        "shippingCharges",
      ]),
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const stockAvailability = {
      inStock: productsCount - productOutOfStock,
      outOfStock: productOutOfStock,
    };

    const grossIncome = allOrders.reduce((total, order) => {
      return total + (order.total || 0);
    }, 0);

    const discount = allOrders.reduce((total, order) => {
      return total + (order.discount || 0);
    }, 0);
    const productionCost = allOrders.reduce((total, order) => {
      return total + (order.shippingCharges || 0);
    }, 0);
    const burnt = allOrders.reduce((total, order) => {
      return total + (order.tax || 0);
    }, 0);
    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((user) => user.age < 20).length,
      adult: allUsers.filter((user) => user.age >= 20 && user.age < 40).length,
      old: allUsers.filter((user) => user.age > 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      adminCustomer,
      usersAgeGroup,
    };

    myCache.set("admin-pie-charts", JSON.stringify(charts));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Dashboard pie charts fetched successfully", charts)
    );
});

export const getBarCharts = asyncError(async (req, res) => {
  let charts;
  const key = "admin-bar-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key)!);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [products, users, orders] = await Promise.all([
      Product.find({ createdAt: { $lte: today, $gte: sixMonthsAgo } }).select(
        "createdAt"
      ),
      User.find({ createdAt: { $lte: today, $gte: sixMonthsAgo } }).select(
        "createdAt"
      ),
      Order.find({ createdAt: { $lte: today, $gte: twelveMonthsAgo } }).select(
        "createdAt"
      ),
    ]);

    const productCounts = getChartData({ length: 6, docArr: products, today });
    const userCounts = getChartData({ length: 6, docArr: users, today });
    const orderCounts = getChartData({ length: 12, docArr: orders, today });

    charts = {
      users: userCounts,
      product: productCounts,
      order: orderCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Dashboard bar charts fetched successfully", charts)
    );
});

export const getLineCharts = asyncError(async (req, res) => {
  let charts;
  const key = "admin-line-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key)!);
  else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = { createdAt: { $lte: today, $gte: twelveMonthsAgo } };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select("createdAt discount total"),
    ]);

    const discount = getChartData({
      length: 12,
      docArr: orders,
      today,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      docArr: orders,
      today,
      property: "total",
    });
    const userCounts = getChartData({ length: 12, docArr: users, today });
    const productCounts = getChartData({ length: 12, docArr: products, today });

    charts = {
      users: userCounts,
      product: productCounts,
      discount,
      revenue,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Dashboard bar charts fetched successfully", charts)
    );
});

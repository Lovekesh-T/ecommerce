import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/type.js";
import { ApiError } from "../utils/apiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import fs from "fs";
import { asyncError } from "../utils/asyncError.js";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/invalidateCache.js";

//get latest products
export const getLatestProducts = asyncError(async (req, res) => {
  let products;
  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products")!);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Latest Product fetched successfully", products)
    );
});

//get all product categories
export const getAllCategories = asyncError(async (req, res) => {
  let categories;
  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories")!);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Categories fetched successfully", categories));
});

// get Admin products
export const getAdminProducts = asyncError(async (req, res) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find();
    myCache.set("all-products", JSON.stringify(products));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Products fetched successfully", products));
});

// get single product
export const getSingleProduct = asyncError(async (req, res) => {
  const { id } = req.params;
  let product;

  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");
    myCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Product fetched successfully", product));
});

// create new product
export const createProduct = asyncError(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) throw new ApiError(400, "Photo is required");

    if (!name || !price || !stock || !category) {
      photo && fs.unlinkSync(photo.path);
      throw new ApiError(400, "All fields are required");
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    invalidateCache({ product: true, admin: true });
    return res
      .status(201)
      .json(new ApiResponse(201, "Product created successfully"));
  }
);

//update product
export const updateProduct = asyncError(async (req, res) => {
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, "Product not found");

  if (photo) {
    fs.unlinkSync(product.photo);
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (name) product.category = category;

  await product.save({ validateBeforeSave: false });

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully"));
});

// delete single product
export const deleteProduct = asyncError(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });
  fs.unlinkSync(product.photo);

  return res
    .status(200)
    .json(new ApiResponse(200, "Product deleted successfully"));
});

//get all filtered products
export const getAllProducts = asyncError(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res: Response) => {
    const { sort, search, price, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};
    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const [products, allProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPages = Math.ceil(allProducts.length / limit);
    return res.status(200).json(
      new ApiResponse(200, "Products fetched successfully", {
        totalPages,
        products,
      })
    );
  }
);

// export const generateProduct = asyncError(async (req, res) => {
//   const products = [];

//   for (let i = 0; i <= 100; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\wallpaperflare_1709551317475.jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }

//   await Product.insertMany(products);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, "Product generated successfully"));
// });

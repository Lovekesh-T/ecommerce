import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export interface NewUserRequestBody {
  name: string;
  email: string;
  role: "admin" | "user";
  gender: "male" | "female";
  photo: string;
  dob: Date;
  _id: string;
}
export interface NewProductRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface ApiErr {
  message: string;
  statusCode: number;
  name?:string;
}

export type ControllerType = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export type BaseQuery = {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
};

export type InvalidateCacheType = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string[] | string;
};

export type OrderItems = {
  name: string;
  price: number;
  photo: number;
  productId: string;
  quantity: number;
};
export type ShippingInfo = {
  address: string;
  state: string;
  city: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfo;
  user: string;
  subTotal: number;
  total: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  orderItems: OrderItems[];
}

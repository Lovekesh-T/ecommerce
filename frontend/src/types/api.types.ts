import {
  CartItem,
  DashboardBar,
  DashboardLine,
  DashboardPie,
  DashboardStats,
  Order,
  Product,
  ShippingInfo,
  User,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
    data: null;
    statusCode: number;
  };
};
export type MessageResponse = {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
};
export type AllUsersResponse = {
  success: boolean;
  data: User[];
  message: string;
  statusCode: number;
};

export type UserResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: User;
};

export type ProductsResponse = {
  success: boolean;
  data: Product[];
  message: string;
  statusCode: number;
};

export type CategoriesResponse = {
  success: boolean;
  data: string[];
  message: string;
  statusCode: number;
};
export type SearchProductsResponse = {
  success: boolean;
  data: {
    totalPage: number;
    products: Product[];
  };
  message: string;
  statusCode: number;
};

export type SearchOptions = {
  price: number;
  page: number;
  sort: string;
  category: string;
  search: string;
};

export type ProductDeatailResponse = {
  success: boolean;
  data: Product;
  message: string;
  statusCode: number;
};
export type ProductUpdateAndDeleteResponse = {
  success: boolean;
  data: Product[];
  message: string;
  statusCode: number;
};

export type AllOrderResponse = {
  success: boolean;
  data: Order[];
  message: string;
  statusCode: number;
};
export type OrderDetailResponse = {
  success: boolean;
  data: Order;
  message: string;
  statusCode: number;
};

export type DashboardStatsResponse = {
  success: boolean;
  data: DashboardStats;
  message: string;
  statusCode: number;
};
export type DashboardPieResponse = {
  success: boolean;
  data: DashboardPie;
  message: string;
  statusCode: number;
};
export type DashboardBarResponse = {
  success: boolean;
  data: DashboardBar;
  message: string;
  statusCode: number;
};
export type DashboardLineResponse = {
  success: boolean;
  data: DashboardLine;
  message: string;
  statusCode: number;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};
export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};
export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

// export type NewOrderRequest = {
//   userId: string;
//   productId: string;
//   formData: FormData;
// };

export type NewOrderRequest = {
  orderItems: CartItem[];
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  user: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};

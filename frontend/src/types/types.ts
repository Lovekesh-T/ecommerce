export interface User {
  name: string;
  photo: string;
  email: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
}

export type Product = {
  name: string;
  photo: string;
  category: string;
  stock: number;
  price: number;
  _id: string;
};
export type ShippingInfo = {
  address: string;
  state: string;
  city: string;
  country: string;
  pinCode: string;
};
export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};
export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

export type CategoriesCount = Record<string, number>;

export type CountAndChangePercent = {
  revenue: number;
  user: number;
  product: number;
  order: number;
};

export type LatestTransactions = {
  _id: string;
  discount: number;
  total: number;
  status: string;
  quantity: 2;
};

export type DashboardStats = {
  categoriesCount: CategoriesCount[];
  count: CountAndChangePercent;
  changePercent: CountAndChangePercent;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: { male: number; female: number };
  latestTransactions: LatestTransactions[];
};

// ---- dashboard pie types

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type ProductCategories = {
  [category: string]: number;
};

type StockAvailability = {
  inStock: number;
  outOfStock: number;
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type AdminCustomer = {
  admin: number;
  customer: number;
};

type UsersAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type DashboardPie = {
  orderFullfillment: OrderFullfillment;
  productCategories: ProductCategories[];
  stockAvailability: StockAvailability;
  revenueDistribution: RevenueDistribution;
  adminCustomer: AdminCustomer;
  usersAgeGroup: UsersAgeGroup;
};

export type DashboardBar = {
  users: number[];
  product: number[];
  order: number[];
};

export type DashboardLine = {
  users: number[];
  product: number[];
  discount: number[];
  revenue: number[];
};

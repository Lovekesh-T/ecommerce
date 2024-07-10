import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CategoriesResponse,
  DeleteProductRequest,
  NewProductRequest,
  ProductDeatailResponse,
  ProductUpdateAndDeleteResponse,
  ProductsResponse,
  SearchOptions,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api.types";

export const productAPI = createApi({
  reducerPath: "productAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product`,
  }),
  tagTypes: ["product"],
  // Make sure `server` is defined somewhere
  endpoints: (builder) => ({
    latestProducts: builder.query<ProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<ProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => "categories",
      providesTags: ["product"],
    }),
    searchProducts: builder.query<SearchProductsResponse, SearchOptions>({
      query: ({ price, sort, category, search, page }) => {
        const baseQuery = "all?";

        const params = new URLSearchParams();
        if (search) params.set("search", `${search}`);
        if (page) params.set("page", `${page}`);
        if (price) params.set("price", `${price}`);
        if (sort) params.set("sort", `${sort}`);
        if (category) params.set("category", `${category}`);

        return baseQuery + "&" + params.toString();
      },
      providesTags: ["product"],
    }),
    productDetails: builder.query<ProductDeatailResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),
    newProducts: builder.mutation<ProductsResponse, NewProductRequest>({
      query: ({ id, formData }) => ({
        url: `create?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation<
      ProductUpdateAndDeleteResponse,
      UpdateProductRequest
    >({
      query: ({ userId, productId, formData }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<
      ProductUpdateAndDeleteResponse,
      DeleteProductRequest
    >({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductsMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;

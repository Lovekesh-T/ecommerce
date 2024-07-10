import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DashboardBarResponse,
  DashboardLineResponse,
  DashboardPieResponse,
  DashboardStatsResponse,
} from "../../types/api.types";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard`,
  }), // Make sure `server` is defined somewhere
  endpoints: (builder) => ({
    stats: builder.query<DashboardStatsResponse, string>({
      query: (id) => `stats?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    pie: builder.query<DashboardPieResponse, string>({
      query: (id) => `pie?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    bar: builder.query<DashboardBarResponse, string>({
      query: (id) => `bar?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    line: builder.query<DashboardLineResponse, string>({
      query: (id) => `line?id=${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardAPI;

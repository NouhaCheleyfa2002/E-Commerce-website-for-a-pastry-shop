import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User", "Products", "Customers", "Transactions", "Geography", "Sales", "Admins", "Performance", "Dashboard", "Category",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `api/general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "api/client/products",
      providesTags: ["Products"],
    }),
    getProductCategories: build.query({
      query: () => 'api/product/categories',
      providesTags: ["Category"],
    }),
    
    getCustomers: build.query({
      query: () => "api/client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search}) => ({
        url: "api/client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "api/client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "api/sales/sales",
      providesTags: ["Sales"]
    }),
    getAdmins: build.query({
      query: () => "api/management/admins",
      providesTags: ["Admins"]
    }),
    getUserPerformance: build.query({
      query: (id) => `api/management/performance/${id}`,
      providesTags: ["Performance"]
    }),
    getDashboard: build.query({
      query: () => "api/general/dashboard",
      providesTags: ["Dashboard"]
    }),

    getNewsletterSubscribers: build.query({
      query: () => "api/newsletter/subscribers",
      providesTags: ["NewsletterSubscribers"]
    }),
   
     // New mutations for update and delete
     updateProduct: build.mutation({
        query: ({ id, updatedProduct }) => ({
          url: `api/client/products/${id}`,
          method: "PUT",
          body: updatedProduct,
        }),
        // After updating, invalidate 'Products' tag to refetch products
        invalidatesTags: ["Products"],
      }),
      deleteProduct: build.mutation({
        query: (id) => ({
          url: `api/client/products/${id}`,
          method: "DELETE",
        }),
        // After deleting, invalidate 'Products' tag to refetch products
        invalidatesTags: ["Products"],
      })
 }),
});

export const {
    useGetUserQuery,
    useGetProductsQuery,  
    useGetCustomersQuery,
    useGetTransactionsQuery,
    useGetGeographyQuery,
    useGetSalesQuery,
    useGetAdminsQuery,
    useGetUserPerformanceQuery,
    useGetDashboardQuery,
    useGetNewsletterSubscribersQuery,
    useGetProductCategoriesQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
  } = api;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Designation",
    "Employee",
    "Zone",
    "UC",
    "Ward",
    "Bin08",
    "Bin5",
    "KundiPoint",
    "GtsPoint",
    "ForkActivity",
    "VehicleType",
    "Vehicle",
    "User",
  ],
  endpoints: (builder) => ({
    loginEmployee: builder.mutation({
      query: (credentials) => ({
        url: "/auth/employee/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getDesignations: builder.query({
      query: () => "/admin/designations",
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Designation", id: "LIST" },
          ...items.map((item) => ({ type: "Designation", id: item._id })),
        ];
      },
    }),
    getPermissionKeys: builder.query({
      query: () => "/admin/permissions",
    }),
    createDesignation: builder.mutation({
      query: (payload) => ({
        url: "/admin/designations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),
    updateDesignation: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/designations/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Designation", id: "LIST" },
        { type: "Designation", id: args.id },
      ],
    }),
    deleteDesignation: builder.mutation({
      query: (id) => ({
        url: `/admin/designations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),
    getEmployees: builder.query({
      query: ({ page = 1, perPage = 20, q = "" } = {}) => ({
        url: "/admin/employees",
        params: {
          page,
          perPage,
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Employee", id: "LIST" },
          ...items.map((item) => ({ type: "Employee", id: item._id })),
        ];
      },
    }),
    createEmployee: builder.mutation({
      query: (payload) => ({
        url: "/admin/employees",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/employees/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Employee", id: "LIST" },
        { type: "Employee", id: args.id },
      ],
    }),
    getZones: builder.query({
      query: () => "/admin/geo/zones",
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Zone", id: "LIST" },
          ...items.map((item) => ({ type: "Zone", id: item._id })),
        ];
      },
    }),
    createZone: builder.mutation({
      query: (payload) => ({
        url: "/admin/geo/zones",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Zone", id: "LIST" }],
    }),
    getUCs: builder.query({
      query: ({ zoneId } = {}) => ({
        url: "/admin/geo/ucs",
        params: zoneId ? { zoneId } : undefined,
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "UC", id: "LIST" },
          ...items.map((item) => ({ type: "UC", id: item._id })),
        ];
      },
    }),
    createUC: builder.mutation({
      query: (payload) => ({
        url: "/admin/geo/ucs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "UC", id: "LIST" }],
    }),
    getWards: builder.query({
      query: ({ zoneId, ucId } = {}) => ({
        url: "/admin/geo/wards",
        params: {
          ...(zoneId ? { zoneId } : {}),
          ...(ucId ? { ucId } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Ward", id: "LIST" },
          ...items.map((item) => ({ type: "Ward", id: item._id })),
        ];
      },
    }),
    createWard: builder.mutation({
      query: (payload) => ({
        url: "/admin/geo/wards",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Ward", id: "LIST" }],
    }),
    getBin08: builder.query({
      query: ({ page = 1, perPage = 20, wardId, q = "" } = {}) => ({
        url: "/admin/bins/bin08",
        params: {
          page,
          perPage,
          ...(wardId ? { wardId } : {}),
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Bin08", id: "LIST" },
          ...items.map((item) => ({ type: "Bin08", id: item._id })),
        ];
      },
    }),
    createBin08: builder.mutation({
      query: (payload) => ({
        url: "/admin/bins/bin08",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Bin08", id: "LIST" }],
    }),
    updateBin08: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/bins/bin08/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Bin08", id: "LIST" },
        { type: "Bin08", id: args.id },
      ],
    }),
    getBin5: builder.query({
      query: ({ page = 1, perPage = 20, q = "" } = {}) => ({
        url: "/admin/bins/bin5",
        params: {
          page,
          perPage,
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Bin5", id: "LIST" },
          ...items.map((item) => ({ type: "Bin5", id: item._id })),
        ];
      },
    }),
    createBin5: builder.mutation({
      query: (payload) => ({
        url: "/admin/bins/bin5",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Bin5", id: "LIST" }],
    }),
    getKundiPoints: builder.query({
      query: ({ page = 1, perPage = 20, wardId, q = "" } = {}) => ({
        url: "/admin/points/kundi",
        params: {
          page,
          perPage,
          ...(wardId ? { wardId } : {}),
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "KundiPoint", id: "LIST" },
          ...items.map((item) => ({ type: "KundiPoint", id: item._id })),
        ];
      },
    }),
    createKundiPoint: builder.mutation({
      query: (payload) => ({
        url: "/admin/points/kundi",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "KundiPoint", id: "LIST" }],
    }),
    getGtsPoints: builder.query({
      query: () => "/admin/points/gts",
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "GtsPoint", id: "LIST" },
          ...items.map((item) => ({ type: "GtsPoint", id: item._id })),
        ];
      },
    }),
    createGtsPoint: builder.mutation({
      query: (payload) => ({
        url: "/admin/points/gts",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "GtsPoint", id: "LIST" }],
    }),
    getForkActivities: builder.query({
      query: ({ page = 1, perPage = 20, placed } = {}) => ({
        url: "/operations/fork/list",
        params: {
          page,
          perPage,
          ...(placed !== undefined ? { placed } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "ForkActivity", id: "LIST" },
          ...items.map((item) => ({ type: "ForkActivity", id: item._id })),
        ];
      },
    }),
    getVehicleTypes: builder.query({
      query: ({ page = 1, perPage = 20, q = "" } = {}) => ({
        url: "/admin/vehicle-types",
        params: {
          page,
          perPage,
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "VehicleType", id: "LIST" },
          ...items.map((item) => ({ type: "VehicleType", id: item._id })),
        ];
      },
    }),
    createVehicleType: builder.mutation({
      query: (payload) => ({
        url: "/admin/vehicle-types",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "VehicleType", id: "LIST" }],
    }),
    updateVehicleType: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/vehicle-types/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "VehicleType", id: "LIST" },
        { type: "VehicleType", id: args.id },
      ],
    }),
    deleteVehicleType: builder.mutation({
      query: (id) => ({
        url: `/admin/vehicle-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "VehicleType", id: "LIST" }],
    }),
    getVehicles: builder.query({
      query: ({ page = 1, perPage = 20, q = "" } = {}) => ({
        url: "/admin/vehicles",
        params: {
          page,
          perPage,
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "Vehicle", id: "LIST" },
          ...items.map((item) => ({ type: "Vehicle", id: item._id })),
        ];
      },
    }),
    createVehicle: builder.mutation({
      query: (payload) => ({
        url: "/admin/vehicles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/vehicles/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "Vehicle", id: "LIST" },
        { type: "Vehicle", id: args.id },
      ],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/admin/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),
    getUsers: builder.query({
      query: ({ page = 1, perPage = 20, q = "" } = {}) => ({
        url: "/admin/users",
        params: {
          page,
          perPage,
          ...(q ? { q } : {}),
        },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || [];
        return [
          { type: "User", id: "LIST" },
          ...items.map((item) => ({ type: "User", id: item._id })),
        ];
      },
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/admin/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "User", id: "LIST" },
        { type: "User", id: args.id },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useLoginEmployeeMutation,
  useGetDesignationsQuery,
  useGetPermissionKeysQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetZonesQuery,
  useCreateZoneMutation,
  useGetUCsQuery,
  useCreateUCMutation,
  useGetWardsQuery,
  useCreateWardMutation,
  useGetBin08Query,
  useCreateBin08Mutation,
  useUpdateBin08Mutation,
  useGetBin5Query,
  useCreateBin5Mutation,
  useGetKundiPointsQuery,
  useCreateKundiPointMutation,
  useGetGtsPointsQuery,
  useCreateGtsPointMutation,
  useGetForkActivitiesQuery,
  useGetVehicleTypesQuery,
  useCreateVehicleTypeMutation,
  useUpdateVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;

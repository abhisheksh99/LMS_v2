import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // Endpoint for user registration
      registerUser: builder.mutation({
        query: (inputData) => ({
          url: "/user/register",
          method: "POST",
          body: inputData,
        }),
      }),
      
      // Endpoint for user login
      loginUser: builder.mutation({
        query: (inputData) => ({
          url: "/user/login",
          method: "POST",
          body: inputData,
        }),
      }),
      
      // Endpoint for user logout
      logoutUser: builder.mutation({
        query: () => ({
          url: "/user/logout", 
          method: "POST",
        }),
      }),
    }),
});

export const { 
  useRegisterUserMutation, 
  useLoginUserMutation, 
  useLogoutUserMutation 
} = authApiSlice;

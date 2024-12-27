import { apiSlice } from "./apiSlice";

// Define the authentication API slice
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
    
    // Endpoint to get user profile by ID
    getUserProfileById: builder.query({
      query: () => ({
        url: `/user/profile/`,
        method: "GET",
      }),
    }),
    
    // Endpoint to update user profile by ID
    updateUserProfileById: builder.mutation({
      query: (formData) => ({
        url: "/user/profile/update",
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});


export const { 
  useRegisterUserMutation, 
  useLoginUserMutation, 
  useLogoutUserMutation, 
  useGetUserProfileByIdQuery, 
  useUpdateUserProfileByIdMutation 
} = authApiSlice;
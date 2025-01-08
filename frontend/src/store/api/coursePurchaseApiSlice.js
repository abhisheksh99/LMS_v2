import { apiSlice } from "./apiSlice";

// Define the course purchase API slice
export const coursePurchaseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation for creating a Stripe Checkout Session
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/purchase/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),

    // Query for getting course details with purchase status
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/purchase/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    // Query for getting all purchased courses
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/purchase/`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for the defined endpoints
export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = coursePurchaseApiSlice;
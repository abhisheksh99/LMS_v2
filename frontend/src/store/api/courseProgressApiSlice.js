import { apiSlice } from "./apiSlice";

// Define the course progress API slice
export const courseProgressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/progress/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/progress/${courseId}/lecture/${lectureId}/view`,
        method: "POST",
      }),
    }),
    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/progress/${courseId}/complete`,
        method: "POST",
      }),
    }),
    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/progress/${courseId}/incomplete`,
        method: "POST",
      }),
    }),
  }),
});


export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = courseProgressApiSlice;
import { apiSlice } from "./apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // Endpoint for course creation
      createCourse: builder.mutation({
        query: ({ courseTitle, category }) => ({
          url: "/course",
          method: "POST",
          body: { courseTitle, category },
        }),
        invalidatesTags: ["Courses"], // Invalidate the Courses tag
      }),
      // Endpoint to get Creator courses
      getCreatorCourses: builder.query({
        query: () => ({
            url:"/course",
            method:"GET"
        }),
        providesTags: ["Courses"]
      }),
      // Endpoint for editing an existing course
      editCourse: builder.mutation({
        query: ({ courseId, formData }) => ({
          url: `/course/${courseId}`,
          method: "PUT",
          body: formData,
        }),
        invalidatesTags: ["Courses"], // Invalidate the Courses tag
      }),
      // Endpoint for retrieving a specific course by ID
      getCourseById: builder.query({
        query: (courseId) => ({
          url: `/course/${courseId}`,
          method: "GET",
        }),
        providesTags: ["Courses"], // Provide the Courses tag
      }),
      // Endpoint for toggling publish status
      togglePublish: builder.mutation({
        query: ({ courseId, query }) => ({
          url: `/course/${courseId}?publish=${query}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Courses"], // Invalidate the Courses tag
      }),
      // Endpoint for removing a course
      removeCourse: builder.mutation({
        query: (courseId) => ({
          url: `/course/${courseId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Courses"], // Invalidate the Courses tag
      }),
    }),
});

export const { 
  useCreateCourseMutation, 
  useGetCreatorCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useTogglePublishMutation,
  useRemoveCourseMutation
} = courseApiSlice;

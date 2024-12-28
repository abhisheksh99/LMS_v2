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
      })
    }),
});

export const { 
  useCreateCourseMutation, 
  useGetCreatorCoursesQuery 
} = courseApiSlice;

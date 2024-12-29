import { apiSlice } from "./apiSlice";

// Define the course API slice
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

    // Endpoint for searching courses
    getSearchCourse: builder.query({
      query: ({ searchQuery = "", categories = [], sortByPrice = "" }) => {
        // Build query string
        let queryString = `/course/search?query=${encodeURIComponent(searchQuery)}`;

        // Append categories if provided
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }

        // Append sortByPrice if available
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
      providesTags: ["Courses"], // Provide the Courses tag
    }),

    // Endpoint for retrieving courses created by the user
    getCreatorCourses: builder.query({
      query: () => ({
        url: "/course",
        method: "GET",
      }),
      providesTags: ["Courses"], // Provide the Courses tag
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

    // Endpoint for retrieving published courses
    getPublishedCourses: builder.query({
      query: () => ({
        url: "/course/published-courses",
        method: "GET",
      }),
      providesTags: ["Courses"], // Provide the Courses tag
    }),

    // Endpoint for creating a lecture within a specific course
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/course/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Courses"], // Invalidate the Courses tag
    }),

    // Endpoint for retrieving lectures for a specific course
    getCourseLectures: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Courses"], // Provide the Courses tag
    }),

    // Endpoint for updating a lecture
    updateLecture: builder.mutation({
      query: ({ courseId, lectureId, lectureTitle, videoInfo, isPreviewFree }) => ({
        url: `/course/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["Courses"], // Invalidate the Courses tag
    }),

    // Endpoint for removing a lecture
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/course/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"], // Invalidate the Courses tag
    }),

    // Endpoint for retrieving a specific lecture by ID
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/course/lecture/${lectureId}`,
        method: "GET",
      }),
      providesTags: ["Courses"], // Provide the Courses tag
    }),
  }),
});

// Export the hooks
export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetCreatorCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useTogglePublishMutation,
  useRemoveCourseMutation,
  useGetPublishedCoursesQuery,
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
  useUpdateLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
} = courseApiSlice;
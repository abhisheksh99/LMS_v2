import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/store/api/courseProgressApiSlice";
import { useParams } from "react-router-dom";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  console.log("API Response:", data);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] =
    useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] =
    useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData?.message || "Course marked as completed.");
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(
        markInCompleteData?.message || "Course marked as incomplete."
      );
    }
  }, [completedSuccess, inCompletedSuccess, markCompleteData, markInCompleteData, refetch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  console.log("Course Details:", courseDetails);
  console.log("Progress:", progress);
  console.log("Completed:", completed);

  const { courseTitle, lectures } = courseDetails;
  console.log(lectures);
  

  const lectureObjects = lectures.map((lecture) => {
    const progressItem = progress.find(p => p.lectureId === lecture._id);
    return {
      ...lecture,
      viewed: progressItem ? progressItem.viewed : false
    };
  });

  console.log('Lectures:', lectures);
console.log('Lecture IDs:', lectures.map(lecture => lecture._id));
console.log('Progress:', progress);
  const initialLecture = currentLecture || lectureObjects[0];

  const isLectureCompleted = (lectureId) => {
    return completed || lectureObjects.find(l => l._id === lectureId)?.viewed;
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl || ""}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            />
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                lectureObjects.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture?._id)
                ) + 1
              }: ${
                currentLecture?.lectureTitle || initialLecture?.lectureTitle || "No Title"
              }`}
            </h3>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {lectureObjects.map((lecture, index) => (
              <Card
                key={lecture._id || index} 
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle || `Lecture ${index + 1}`}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
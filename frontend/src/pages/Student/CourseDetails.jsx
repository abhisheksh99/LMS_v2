
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import ReactPlayer from "react-player";
import BuyCourseButton from "@/components/BuyCourseButton";
import { BadgeInfoIcon, Lock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "@/store/api/coursePurchaseApiSlice";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId; // Extract courseId from URL params
  const navigate = useNavigate();

  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to load course details</h1>;

  // Destructure response data
  const { course, purchased } = data;

  // Handle continue course button click
  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${course._id}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Course Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfoIcon size={16} />
            <p>
              Last updated {new Date(course.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <p>Students enrolled: {course.enrolledStudents.length}</p>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Section: Course Description and Content */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {purchased ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Video Player and Purchase/Continue Button */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <div className="w-full aspect-video mb-4">
                  {console.log(
                    "Video URL:",
                    course.lectures[0]?.videoUrl || ""
                  )}
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0]?.videoUrl || ""}
                    controls={true}
                  />
                </div>
              </div>
              <h1>
                {course.lectures[0]?.lectureTitle || "No lecture available"}
              </h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                ${course.coursePrice}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={course._id} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

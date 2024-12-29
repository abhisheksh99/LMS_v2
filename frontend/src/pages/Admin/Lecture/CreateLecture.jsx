import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Lecture from "./Lecture";
import {
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
} from "@/store/api/courseApiSlice";
import { toast } from "react-toastify";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [createLecture, { data, isLoading, error, isSuccess }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetCourseLecturesQuery(courseId);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created successfully!");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create lecture.");
    }
  }, [isSuccess, error, navigate, courseId, data]);

  const createLectureHandler = async () => {
    try {
      await createLecture({ lectureTitle, courseId });
    } catch (err) {
      toast.error("An unexpected error occurred while creating the lecture.");
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Easily create a new lecture by filling out the details below. Provide
          a title and any relevant materials to make your lecture engaging and
          informative.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/courses/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures. Please try again later.</p>
          ) : lectureData?.lecture?.length === 0 ? (
            <p>No lectures available</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
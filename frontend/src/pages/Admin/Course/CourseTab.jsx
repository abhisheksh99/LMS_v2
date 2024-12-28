import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useRemoveCourseMutation,
  useTogglePublishMutation,
} from "@/store/api/courseApiSlice";

const CourseTab = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    isPublished: false,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const { data: courseByIdData, isLoading: courseByIdDataLoading } =
    useGetCourseByIdQuery(courseId);
  console.log(courseByIdData);

  const [editCourse, { isLoading: isEditing }] = useEditCourseMutation();

  const [togglePublishStatus] = useTogglePublishMutation();

  const [removeCourse, { isLoading: isRemoving }] = useRemoveCourseMutation();

  useEffect(() => {
    if (!courseByIdData) {
      setInput({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
        isPublished: false,
      });
      return; // Exit early if the course is not found
    }
  
    if (!courseByIdDataLoading && courseByIdData?.course) {
      const course = courseByIdData.course;

      setInput((prevInput) => ({
        courseTitle: prevInput.courseTitle || course.courseTitle || "",
        subTitle: prevInput.subTitle || course.subTitle || "",
        description: prevInput.description || course.description || "",
        category: prevInput.category || course.category || "",
        courseLevel: prevInput.courseLevel || course.courseLevel || "",
        coursePrice:
          prevInput.coursePrice ||
          (course.coursePrice ? String(course.coursePrice) : ""),
        courseThumbnail:
          prevInput.courseThumbnail || course.courseThumbnail || "",
        isPublished: prevInput.isPublished ?? course.isPublished ?? false,
      }));

      if (course.courseThumbnail && !previewThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
    }
  }, [courseByIdData, courseByIdDataLoading, previewThumbnail]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setInput((prevInput) => ({
      ...prevInput,
      category: value,
    }));
  };

  const selectCourseLevel = (value) => {
    setInput((prevInput) => ({
      ...prevInput,
      courseLevel: value,
    }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);

      setInput((prevInput) => ({
        ...prevInput,
        courseThumbnail: file,
      }));
    }
  };

  const ontogglePublishStatus = async () => {
    try {
      const publishStatus = !input.isPublished;
      await togglePublishStatus({ courseId, publish: publishStatus }).unwrap();
      setInput((prevInput) => ({
        ...prevInput,
        isPublished: publishStatus,
      }));
      toast.success(
        publishStatus
          ? "Course published successfully!"
          : "Course unpublished successfully!"
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update publish status");
    }
  };

  const updateCourseHandler = async () => {
    try {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== "") {
          formData.append(key, value);
        }
      });

      await editCourse({ courseId, formData }).unwrap();
      toast.success("Course updated successfully");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  const handleRemoveCourse = async () => {
    if (
      window.confirm(
        "Are you sure you want to remove this course and its lectures?"
      )
    ) {
      try {
        await removeCourse(courseId).unwrap();
        toast.success("Course and its lectures removed successfully!");
        navigate("/admin/courses");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to remove course.");
      }
    }
  };

  if (courseByIdDataLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button disabled = {courseByIdData?.course?.lectures.length === 0} variant="outline" onClick={ontogglePublishStatus}>
            {input.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={handleRemoveCourse}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove Course"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              placeholder="Ex. Fullstack developer"
              value={input.courseTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
              value={input.subTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Node.js">Node.js</SelectItem>
                    <SelectItem value="Express.js">Express.js</SelectItem>
                    <SelectItem value="Angular">Angular</SelectItem>
                    <SelectItem value="Vue.js">Vue.js</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Terraform">Terraform</SelectItem>
                    <SelectItem value="AWS">AWS</SelectItem>
                    <SelectItem value="Kubernetes">Kubernetes</SelectItem>
                    <SelectItem value="CI/CD Pipelines">
                      CI/CD Pipelines
                    </SelectItem>
                    <SelectItem value="Cloud Computing">
                      Cloud Computing
                    </SelectItem>
                    <SelectItem value="Linux Administration">
                      Linux Administration
                    </SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Git & Version Control">
                      Git & Version Control
                    </SelectItem>
                    <SelectItem value="Ansible">Ansible</SelectItem>
                    <SelectItem value="Prometheus">Prometheus</SelectItem>
                    <SelectItem value="Grafana">Grafana</SelectItem>
                    <SelectItem value="Machine Learning">
                      Machine Learning
                    </SelectItem>
                    <SelectItem value="Artificial Intelligence">
                      Artificial Intelligence
                    </SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="SQL">SQL</SelectItem>
                    <SelectItem value="NoSQL">NoSQL</SelectItem>
                    <SelectItem value="GCP (Google Cloud Platform)">
                      GCP (Google Cloud Platform)
                    </SelectItem>
                    <SelectItem value="Azure">Azure</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (USD)</Label>
              <Input
                type="number"
                name="coursePrice"
                placeholder="199"
                className="w-fit"
                value={input.coursePrice}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              className="w-fit"
              onChange={selectThumbnail}
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/courses")}
              disabled={isEditing}
            >
              Cancel
            </Button>
            <Button disabled={isEditing} onClick={updateCourseHandler}>
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const isLoading = false;
  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = () => {
    console.log(courseTitle, category);
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          {" "}
          Let's add a course, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          Fill in the details to add a new course. This information will help
          structure and categorize your course effectively.
        </p>
      </div>
      <div className="space-y-4s">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            placeholder="Your Course Name"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger id="category" className="w-full">
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
                <SelectItem value="CI/CD Pipelines">CI/CD Pipelines</SelectItem>
                <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
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
        <div className="flex items-center gap-2 mt-5">
          <Button variant="outline" onClick={() => navigate("/admin/courses")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;

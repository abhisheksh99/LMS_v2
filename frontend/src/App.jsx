import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import Sidebar from "./pages/admin/Sidebar";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetails from "./pages/Student/CourseDetails";
import CourseProgress from "./pages/Student/CourseProgress";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar: The top navigation bar displayed on all pages */}
      <Navbar />

      {/* Content Section: Adjusts dynamically based on the routes */}
      <div className="flex-grow mt-16 px-4">
        <Routes>
          {/* Main layout with nested routes */}
          <Route path="/" element={<MainLayout />}>
            {/* Default route (homepage) renders HeroSection */}
            <Route index element={<HeroSection />} />
          </Route>

          {/* Login page route */}
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          {/* My Learning page: Displays courses the student is enrolled in */}
          <Route path="/my-learning" element={<MyLearning />} />
          {/* Profile page: Allows students to edit and view their profile */}
          <Route path="/profile" element={<Profile />} />
          {/* Course Details page: Displays detailed information about a course */}
          <Route path="/course-detail/:courseId" element={<CourseDetails />} />
          <Route
            path="/course-progress/:courseId"
            element={<CourseProgress />}
          />

          {/* Admin Routes */}
          {/* Admin layout with a sidebar for navigation */}
          <Route path="/admin" element={<Sidebar />}>
            {/* Admin dashboard route */}
            <Route path="dashboard" element={<Dashboard />} />
            {/* Courses table route */}
            <Route path="courses" element={<CourseTable />} />
            {/* Add a new course */}
            <Route path="courses/create" element={<AddCourse />} />
            {/* Edit an existing course by courseId */}
            <Route path="courses/:courseId" element={<EditCourse />} />
            {/* Create a lecture for a specific course */}
            <Route
              path="courses/:courseId/lecture"
              element={<CreateLecture />}
            />
            {/* Edit an existing lecture by courseId and lectureId */}
            <Route
              path="courses/:courseId/lecture/:lectureId"
              element={<EditLecture />}
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;

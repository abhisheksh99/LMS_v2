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
import CourseDetails from "./pages/student/CourseDetails";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoute";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider>
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
            <Route
              path="/login"
              element={
                <AuthenticatedUser>
                  <Login />
                </AuthenticatedUser>
              }
            />

            {/* Student Routes */}
            <Route
              path="/my-learning"
              element={
                <ProtectedRoute>
                  <MyLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course-detail/:courseId"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course-progress/:courseId"
              element={
                <ProtectedRoute>
                  <PurchaseCourseProtectedRoute>
                    <CourseProgress />
                  </PurchaseCourseProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Sidebar />
                </AdminRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<CourseTable />} />
              <Route path="courses/create" element={<AddCourse />} />
              <Route path="courses/:courseId" element={<EditCourse />} />
              <Route
                path="courses/:courseId/lecture"
                element={<CreateLecture />}
              />
              <Route
                path="courses/:courseId/lecture/:lectureId"
                element={<EditLecture />}
              />
            </Route>
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;

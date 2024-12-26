import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import HeroSection from "./pages/Student/HeroSection";
import MyLearning from "./pages/Student/MyLearning";
import Profile from "./pages/Student/Profile";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow mt-16">
        <Routes>
          {/* Main layout with nested routes */}
          <Route path="/" element={<MainLayout />}>
            {/* Default route (homepage) renders HeroSection */}
            <Route index element={<HeroSection />} />
          </Route>
          {/* Route for the Login page */}
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          {/* My Learning page: Displays courses the student is enrolled in */}
          <Route path="/my-learning" element={<MyLearning />} />
          {/* Profile page: Allows students to edit and view their profile */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

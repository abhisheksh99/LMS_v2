import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow mt-16 px-4">
        <Routes>
          {/* Route for the Login page */}
          <Route path="/login" element={<Login />} />

          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default App;

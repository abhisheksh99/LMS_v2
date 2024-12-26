import React from 'react'
import Login from './pages/Login'
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
<div className="min-h-screen flex flex-col">
      <div className="flex-grow mt-16 px-4">
        <Routes>

          {/* Login page route */}
          <Route path="/login" element={<Login />} />
          

        </Routes>
      </div>
    </div>
  )
}

export default App
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div>
        <h1>Movie Booking App</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect to login */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/me" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

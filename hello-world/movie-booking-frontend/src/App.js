import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import MoviesList from './components/MoviesList';
import MoviesSearchPagination from './components/MoviesSearchPagination';
import Reservation from './components/Reservation';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="text-2xl font-bold mb-2 md:mb-0">Movie Booking App</Link>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-blue-200">Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/reservations" className="hover:text-blue-200">My Reservations</Link>
                  <Link to="/me" className="hover:text-blue-200">Profile</Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    className="hover:text-blue-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-200">Login</Link>
                  <Link to="/register" className="hover:text-blue-200">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route 
              path="/" 
              element={
                <div>
                  <MoviesSearchPagination 
                    onSearch={setSearchQuery}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                  <MoviesList 
                    searchQuery={searchQuery}
                    page={currentPage}
                    pageSize={pageSize}
                  />
                </div>
              } 
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/me" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reservations" 
              element={isAuthenticated ? <Reservation /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

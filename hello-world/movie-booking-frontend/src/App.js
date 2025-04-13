import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import MoviesList from './components/MoviesList';
import MoviesSearchPagination from './components/MoviesSearchPagination';
import Reservation from './components/Reservation';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    // Add request interceptor for JWT token
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for handling token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <Link to="/" className="text-2xl font-bold mb-2 md:mb-0">Movie Booking App</Link>
              <div className="flex gap-4">
                <Link to="/" className="hover:text-blue-200 transition duration-200">Home</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/reservations" className="hover:text-blue-200 transition duration-200">My Reservations</Link>
                    <Link to="/me" className="hover:text-blue-200 transition duration-200">Profile</Link>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                      className="hover:text-blue-200 transition duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="hover:text-blue-200 transition duration-200">Login</Link>
                    <Link to="/register" className="hover:text-blue-200 transition duration-200">Register</Link>
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
                  <ErrorBoundary>
                    <div>
                      <MoviesSearchPagination 
                        onSearch={handleSearch}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                      />
                      <MoviesList 
                        searchQuery={searchQuery}
                        page={currentPage}
                        pageSize={pageSize}
                        onTotalPagesChange={setTotalPages}
                      />
                    </div>
                  </ErrorBoundary>
                } 
              />
              <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route 
                path="/me" 
                element={isAuthenticated ? <ErrorBoundary><Profile /></ErrorBoundary> : <Navigate to="/login" />} 
              />
              <Route 
                path="/reservations" 
                element={isAuthenticated ? <ErrorBoundary><Reservation /></ErrorBoundary> : <Navigate to="/login" />} 
              />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

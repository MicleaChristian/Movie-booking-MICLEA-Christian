import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile. Please try again later.');
        
        // If unauthorized, clear token and redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        No user data available. Please <a href="/login" className="text-blue-500 underline">login</a>.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">Username</p>
          <p className="font-semibold">{user.username}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">Email</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">Account Status</p>
          <p className="font-semibold">
            {user.isActive ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/reservations')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-4"
        >
          My Reservations
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile; 
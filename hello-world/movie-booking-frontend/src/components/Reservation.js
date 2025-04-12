import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    movieId: '',
    movieTitle: '',
    startTime: '',
  });

  // Get JWT token from local storage
  const token = localStorage.getItem('token');

  // Set up axios headers
  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reservations`,
        { headers }
      );
      setReservations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch reservations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel a reservation
  const cancelReservation = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/reservations/${id}`,
        { headers }
      );
      // Refresh reservations list
      fetchReservations();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      setError(`Failed to cancel reservation: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit reservation form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/reservations`,
        formData,
        { headers }
      );
      // Reset form and hide it
      setFormData({
        movieId: '',
        movieTitle: '',
        startTime: '',
      });
      setShowForm(false);
      // Refresh reservations list
      fetchReservations();
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError(`Failed to create reservation: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  // Load reservations on component mount
  useEffect(() => {
    if (token) {
      fetchReservations();
    } else {
      setError('You must be logged in to view reservations.');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="text-center py-10">Loading reservations...</div>;
  }

  if (error && !token) {
    return (
      <div className="text-center py-10 text-red-500">
        {error} <a href="/login" className="text-blue-500 underline">Login</a>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Reservations</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Reservation'}
        </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">{error}</div>}

      {/* New Reservation Form */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Reservation</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="movieId">
                Movie ID
              </label>
              <input
                type="number"
                id="movieId"
                name="movieId"
                value={formData.movieId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="movieTitle">
                Movie Title
              </label>
              <input
                type="text"
                id="movieTitle"
                name="movieTitle"
                value={formData.movieTitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="startTime">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Create Reservation
            </button>
          </form>
        </div>
      )}

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <div className="text-center py-6 bg-gray-100 rounded-lg">
          You don't have any reservations yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{reservation.movieTitle}</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Start:</span>{' '}
                  {new Date(reservation.startTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">End:</span>{' '}
                  {new Date(reservation.endTime).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => cancelReservation(reservation.id)}
                className="mt-3 md:mt-0 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservation; 
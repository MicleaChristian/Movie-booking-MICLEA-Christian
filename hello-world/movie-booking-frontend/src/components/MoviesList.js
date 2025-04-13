import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MovieSkeleton from './MovieSkeleton';

const MoviesList = ({ searchQuery, page, pageSize, onTotalPagesChange }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const navigate = useNavigate();

  // Generate available dates and times
  useEffect(() => {
    if (showBookingModal) {
      const dates = [];
      const times = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Generate dates for the next 3 days
      for (let day = 0; day < 3; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
      
      // Generate times from 8 AM to 10 PM with 2-hour intervals
      for (let hour = 8; hour <= 22; hour += 2) {
        const time = new Date();
        time.setHours(hour, 0, 0, 0);
        times.push({
          value: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        });
      }
      
      setAvailableDates(dates);
      setAvailableTimes(times);
      
      // Set default selections
      if (dates.length > 0) setSelectedDate(dates[0].value);
      if (times.length > 0) setSelectedTime(times[0].value);
    }
  }, [showBookingModal]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${process.env.REACT_APP_API_URL}/movies/now-playing`;
        
        if (searchQuery) {
          url = `${process.env.REACT_APP_API_URL}/movies/search?query=${encodeURIComponent(searchQuery)}`;
        }
        
        if (page && pageSize) {
          url += `${url.includes('?') ? '&' : '?'}page=${page}&limit=${pageSize}`;
        }
        
        const response = await axios.get(url);
        const { results, total, totalPages: pages } = response.data;
        setMovies(results);
        setTotalResults(total);
        setTotalPages(pages);
        onTotalPagesChange?.(pages);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err.response?.data?.message || 'Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [searchQuery, page, pageSize, onTotalPagesChange]);

  const handleBookNow = (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setSelectedMovie(movie);
    setShowBookingModal(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMovie || !selectedDate || !selectedTime) return;
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Combine date and time into a single ISO string
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours, 10));
      dateTime.setMinutes(parseInt(minutes, 10));
      
      const reservationData = {
        movieId: parseInt(selectedMovie.id, 10),
        movieTitle: selectedMovie.title,
        startTime: dateTime.toISOString(),
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reservations`,
        reservationData,
        { headers }
      );
      
      if (response.data) {
        setShowBookingModal(false);
        setSelectedDate('');
        setSelectedTime('');
        
        alert('Reservation created successfully!');
        navigate('/reservations');
      }
    } catch (err) {
      console.error('Error creating reservation:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create reservation. Please try again later.';
      alert(`Failed to create reservation: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(6)].map((_, index) => (
          <MovieSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-gray-600">No movies found.</p>
          {searchQuery && (
            <p className="text-gray-500 mt-2">
              Try adjusting your search criteria.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 truncate">{movie.title}</h3>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{movie.overview}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Release: {new Date(movie.release_date).toLocaleDateString()}
                </span>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm transition duration-200"
                  onClick={() => handleBookNow(movie)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center text-gray-600 mt-4">
        Showing {movies.length} of {totalResults} movies
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Book {selectedMovie.title}</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="date">
                    Select Date
                  </label>
                  <select
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {availableDates.map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="time">
                    Select Time
                  </label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {availableTimes.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesList; 
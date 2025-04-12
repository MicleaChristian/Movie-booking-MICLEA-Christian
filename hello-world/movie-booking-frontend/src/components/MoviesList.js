import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MoviesList = ({ searchQuery, page, pageSize }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = `${process.env.REACT_APP_API_URL}/movies/now-playing`;
        
        // If search query is provided, use search endpoint instead
        if (searchQuery) {
          url = `${process.env.REACT_APP_API_URL}/movies/search?query=${searchQuery}`;
        }
        
        // Add pagination parameters
        if (page && pageSize) {
          url += `${url.includes('?') ? '&' : '?'}page=${page}&limit=${pageSize}`;
        }
        
        const response = await axios.get(url);
        setMovies(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [searchQuery, page, pageSize]);

  if (loading) {
    return <div className="text-center py-10">Loading movies...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (movies.length === 0) {
    return <div className="text-center py-10">No movies found.</div>;
  }

  return (
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
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full text-sm"
                onClick={() => {
                  // Navigate to reservation page or open modal to book this movie
                  console.log('Book movie:', movie.title);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesList; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieSkeleton from './MovieSkeleton';

const MoviesList = ({ searchQuery, page, pageSize, onTotalPagesChange }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${process.env.REACT_APP_API_URL}/movies/now-playing`;
        
        // If search query is provided, use search endpoint instead
        if (searchQuery) {
          url = `${process.env.REACT_APP_API_URL}/movies/search?query=${encodeURIComponent(searchQuery)}`;
        }
        
        // Add pagination parameters
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
      <div className="text-center text-gray-600 mt-4">
        Showing {movies.length} of {totalResults} movies
      </div>
    </div>
  );
};

export default MoviesList; 
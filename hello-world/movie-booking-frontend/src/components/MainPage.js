import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNowPlayingMovies } from '../services/tmdbService';

function MainPage({ user }) {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const nowPlaying = await fetchNowPlayingMovies();
                setMovies(nowPlaying);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            }
        };
        loadMovies();
    }, []);

    const handleLogout = () => {
        document.cookie = 'token=; Max-Age=0'; // Clear the token cookie
        navigate('/'); // Redirect to the login page
    };

    if (!user) {
        return null; // Prevent rendering if user is not defined
    }

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
            <h2>Now Playing Movies</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {movies.map(movie => (
                    <div key={movie.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '100%' }}
                        />
                        <h3>{movie.title}</h3>
                        <p>{movie.overview.substring(0, 100)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
